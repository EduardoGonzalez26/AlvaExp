import {z} from "zod";
import {isIsoCountryCode} from "../countries";
import {
  BUSINESS_STAGES,
  CONTACT_LOCALES,
  INQUIRY_TYPES,
  type ContactFieldErrors,
  type InquiryType
} from "./types";

/**
 * Server-side validation for the contact form.
 *
 * Conditional matrix (mirrors section 7 of the project brief):
 * - expansion:     website, role, country, stage apply (all optional)
 * - referral:      website, country apply; role and stage do not
 * - collaboration: role applies; website, country and stage do not
 * - other:         only general fields apply
 *
 * Fields that do not apply are rejected when they carry a value instead of
 * being silently ignored. Empty strings are normalized to "absent" so a
 * frontend that always submits every input does not need special cases.
 */

const LINE_BREAKS = /[\r\n]/;

const CONDITIONAL_FIELDS = [
  "website",
  "role",
  "country",
  "stage"
] as const;

type ConditionalField = (typeof CONDITIONAL_FIELDS)[number];

const APPLICABLE_FIELDS: Record<InquiryType, readonly ConditionalField[]> = {
  expansion: ["website", "role", "country", "stage"],
  referral: ["website", "country"],
  collaboration: ["role"],
  other: []
};

function hasNoLineBreaks(value: string): boolean {
  return !LINE_BREAKS.test(value);
}

function normalizeSingleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isBlank(value: string): boolean {
  return /^[ \t]*$/.test(value);
}

function trimString(value: unknown): unknown {
  return typeof value === "string" ? value.trim() : value;
}

/** Required single-line text: trim, collapse spaces, reject CR/LF. */
function requiredText(max: number) {
  return z
    .string()
    .refine(hasNoLineBreaks, {message: "Line breaks are not allowed."})
    .transform(normalizeSingleLine)
    .refine((value) => value.length > 0, {message: "This field is required."})
    .refine((value) => value.length <= max, {
      message: `Must be at most ${max} characters.`
    });
}

/**
 * Optional single-line text. Only spaces/tabs count as blank: a value that
 * contains CR/LF is still validated (and rejected) instead of disappearing.
 */
function optionalText(max: number) {
  return z.preprocess(
    (value) => (typeof value === "string" && isBlank(value) ? undefined : value),
    z
      .string()
      .refine(hasNoLineBreaks, {message: "Line breaks are not allowed."})
      .transform(normalizeSingleLine)
      .refine((value) => value.length <= max, {
        message: `Must be at most ${max} characters.`
      })
      .optional()
  );
}

/** Email trimmed first, then validated; CR/LF always rejected. */
const emailSchema = z
  .string()
  .refine(hasNoLineBreaks, {message: "Line breaks are not allowed."})
  .transform((value) => value.trim())
  .refine((value) => value.length > 0, {message: "This field is required."})
  .refine((value) => value.length <= 254, {
    message: "Must be at most 254 characters."
  })
  .pipe(z.email({message: "Enter a valid email address."}).max(254));

/** Description allows line breaks but normalizes CRLF to LF and trims. */
function requiredDescription(max: number) {
  return z
    .string()
    .transform((value) => value.replace(/\r\n?/g, "\n").trim())
    .refine((value) => value.length > 0, {message: "This field is required."})
    .refine((value) => value.length <= max, {
      message: `Must be at most ${max} characters.`
    });
}

/**
 * ISO 3166-1 alpha-2: normalized to uppercase and checked against the shared
 * list. An empty value stays "not provided".
 */
const countrySchema = z.preprocess(
  (value) => (typeof value === "string" && isBlank(value) ? undefined : value),
  z
    .string()
    .refine(hasNoLineBreaks, {message: "Line breaks are not allowed."})
    .transform((value) => value.trim().toUpperCase())
    .refine(isIsoCountryCode, {
      message: "Use a two-letter country code."
    })
    .optional()
);

/** Empty strings from an untouched select are treated as "not provided". */
const stageSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.enum(BUSINESS_STAGES).optional()
);

const inquiryTypeSchema = z.preprocess(
  trimString,
  z.enum(INQUIRY_TYPES, {message: "Select a valid inquiry type."})
);

const localeSchema = z.preprocess(
  trimString,
  z.enum(CONTACT_LOCALES, {message: "Select a valid locale."})
);

const turnstileTokenSchema = optionalText(4096);

export const contactPayloadSchema = z
  .strictObject({
    inquiryType: inquiryTypeSchema,
    fullName: requiredText(120),
    email: emailSchema,
    company: optionalText(160),
    markets: optionalText(200),
    description: requiredDescription(800),
    privacyAccepted: z
      .boolean({message: "You must accept the Privacy Notice."})
      .refine((value) => value === true, {
        message: "You must accept the Privacy Notice."
      }),
    website: optionalText(300),
    role: optionalText(120),
    country: countrySchema,
    stage: stageSchema,
    referralSource: optionalText(200),
    locale: localeSchema,
    turnstileToken: turnstileTokenSchema
  })
  .superRefine((data, ctx) => {
    const applicable = new Set<ConditionalField>(
      APPLICABLE_FIELDS[data.inquiryType]
    );

    for (const field of CONDITIONAL_FIELDS) {
      if (data[field] !== undefined && !applicable.has(field)) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "Not available for this inquiry type."
        });
      }
    }
  });

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

export type ContactValidationResult =
  | {success: true; data: ContactPayload}
  | {success: false; fieldErrors: ContactFieldErrors};

/** Key used when the error is about the whole payload, not a single field. */
export const FORM_ERROR_KEY = "_form";

function formatIssue(issue: z.ZodIssue): string {
  switch (issue.code) {
    case "invalid_type":
      return issue.input === undefined
        ? "This field is required."
        : "Invalid value.";
    case "too_big":
      return `Must be at most ${String(issue.maximum)} characters.`;
    case "too_small":
      return "This field is required.";
    case "invalid_format":
      return issue.format === "email"
        ? "Enter a valid email address."
        : "Invalid format.";
    case "invalid_value":
      return issue.message;
    case "unrecognized_keys":
      return "Unknown field.";
    default:
      return issue.message;
  }
}

/**
 * Validates a decoded JSON value. Returns either the normalized payload or a
 * flat map of field error messages. Unknown fields are reported individually.
 */
export function validateContactPayload(input: unknown): ContactValidationResult {
  const result = contactPayloadSchema.safeParse(input);

  if (result.success) {
    return {success: true, data: result.data};
  }

  const fieldErrors: ContactFieldErrors = {};

  for (const issue of result.error.issues) {
    if (issue.code === "unrecognized_keys") {
      for (const key of issue.keys) {
        fieldErrors[key] ??= "Unknown field.";
      }
      continue;
    }

    const key =
      typeof issue.path[0] === "string" ? issue.path[0] : FORM_ERROR_KEY;
    fieldErrors[key] ??= formatIssue(issue);
  }

  return {success: false, fieldErrors};
}
