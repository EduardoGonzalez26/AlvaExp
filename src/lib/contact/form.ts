import {
  BUSINESS_STAGES,
  INQUIRY_TYPES,
  type BusinessStage,
  type ContactLocale,
  type InquiryType
} from "./types";

/**
 * Client-side helpers for the contact form.
 *
 * This module is deliberately free of React and of server-only imports so the
 * conditional matrix, the payload assembly and the error mapping can be unit
 * tested and reused by the form component.
 */

export const CONTACT_FIELD_NAMES = [
  "inquiryType",
  "fullName",
  "email",
  "company",
  "markets",
  "description",
  "privacyAccepted",
  "website",
  "role",
  "country",
  "stage",
  "referralSource"
] as const;

export type ContactFieldName = (typeof CONTACT_FIELD_NAMES)[number];

/** The Turnstile widget is not a payload field, but it can hold a form error. */
export type ContactErrorTarget = ContactFieldName | "turnstile";

export type ContactFormValues = {
  inquiryType: InquiryType | "";
  fullName: string;
  email: string;
  company: string;
  markets: string;
  description: string;
  privacyAccepted: boolean;
  website: string;
  role: string;
  country: string;
  stage: BusinessStage | "";
  referralSource: string;
};

export type ContactFieldErrorKey =
  | "required"
  | "requiredSelect"
  | "tooLong"
  | "invalidEmail"
  | "lineBreaks"
  | "privacyRequired"
  | "invalidInquiry"
  | "invalidCountry"
  | "invalidStage"
  | "invalidValue"
  | "notApplicable"
  | "unknownField"
  | "verificationRequired"
  | "verificationUnavailable";

export type ContactFieldError = {
  key: ContactFieldErrorKey;
  /** Present for `tooLong`, so the localized message can show the limit. */
  max?: number;
};

export type ContactFormErrors = Partial<
  Record<ContactErrorTarget, ContactFieldError>
>;

/** Visible field order, used by the summary and by the accessibility pass. */
export const CONTACT_ERROR_ORDER: readonly ContactErrorTarget[] = [
  ...CONTACT_FIELD_NAMES,
  "turnstile"
];

export const FIELD_MAX_LENGTH = {
  fullName: 120,
  email: 254,
  company: 160,
  markets: 200,
  description: 800,
  website: 300,
  role: 120,
  referralSource: 200
} as const;

export const DESCRIPTION_MAX_LENGTH = FIELD_MAX_LENGTH.description;

type ConditionalField = "website" | "role" | "country" | "stage";

/**
 * Conditional matrix from section 7 of the brief and from the API contract.
 * Fields outside this map are always visible.
 */
export const CONDITIONAL_FIELD_RULES: Record<
  ConditionalField,
  readonly InquiryType[]
> = {
  website: ["expansion", "referral"],
  role: ["expansion", "collaboration"],
  country: ["expansion", "referral"],
  stage: ["expansion"]
};

export function isContactFieldName(value: string): value is ContactFieldName {
  return (CONTACT_FIELD_NAMES as readonly string[]).includes(value);
}

export function isContactFieldVisible(
  field: ContactFieldName,
  inquiryType: InquiryType | ""
): boolean {
  switch (field) {
    case "website":
      return (
        inquiryType !== "" &&
        CONDITIONAL_FIELD_RULES.website.includes(inquiryType)
      );
    case "role":
      return (
        inquiryType !== "" &&
        CONDITIONAL_FIELD_RULES.role.includes(inquiryType)
      );
    case "country":
      return (
        inquiryType !== "" &&
        CONDITIONAL_FIELD_RULES.country.includes(inquiryType)
      );
    case "stage":
      return (
        inquiryType !== "" &&
        CONDITIONAL_FIELD_RULES.stage.includes(inquiryType)
      );
    default:
      return true;
  }
}

export function createEmptyContactForm(): ContactFormValues {
  return {
    inquiryType: "",
    fullName: "",
    email: "",
    company: "",
    markets: "",
    description: "",
    privacyAccepted: false,
    website: "",
    role: "",
    country: "",
    stage: "",
    referralSource: ""
  };
}

function normalizeSingleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeDescription(value: string): string {
  return value.replace(/\r\n?/g, "\n").trim();
}

function hasLineBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

function validateSingleLine(
  value: string,
  max: number,
  errors: ContactFormErrors,
  field: ContactFieldName,
  required = false
): void {
  if (hasLineBreak(value)) {
    errors[field] = {key: "lineBreaks"};
    return;
  }

  const normalized = normalizeSingleLine(value);

  if (normalized === "") {
    if (required) {
      errors[field] = {key: "required"};
    }
    return;
  }

  if (normalized.length > max) {
    errors[field] = {key: "tooLong", max};
  }
}

/**
 * Validates only the fields that apply to the selected inquiry type. Hidden
 * fields keep their values in component state but never block submission.
 */
export function validateContactForm(
  values: ContactFormValues
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (values.inquiryType === "") {
    errors.inquiryType = {key: "requiredSelect"};
  } else if (!INQUIRY_TYPES.includes(values.inquiryType)) {
    errors.inquiryType = {key: "invalidInquiry"};
  }

  validateSingleLine(
    values.fullName,
    FIELD_MAX_LENGTH.fullName,
    errors,
    "fullName",
    true
  );

  if (hasLineBreak(values.email)) {
    errors.email = {key: "lineBreaks"};
  } else {
    const email = values.email.trim();
    if (email === "") {
      errors.email = {key: "required"};
    } else if (email.length > FIELD_MAX_LENGTH.email) {
      errors.email = {key: "tooLong", max: FIELD_MAX_LENGTH.email};
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = {key: "invalidEmail"};
    }
  }

  validateSingleLine(
    values.company,
    FIELD_MAX_LENGTH.company,
    errors,
    "company"
  );
  validateSingleLine(
    values.markets,
    FIELD_MAX_LENGTH.markets,
    errors,
    "markets"
  );

  const description = normalizeDescription(values.description);
  if (description === "") {
    errors.description = {key: "required"};
  } else if (description.length > FIELD_MAX_LENGTH.description) {
    errors.description = {
      key: "tooLong",
      max: FIELD_MAX_LENGTH.description
    };
  }

  if (!values.privacyAccepted) {
    errors.privacyAccepted = {key: "privacyRequired"};
  }

  if (isContactFieldVisible("website", values.inquiryType)) {
    validateSingleLine(
      values.website,
      FIELD_MAX_LENGTH.website,
      errors,
      "website"
    );
  }

  if (isContactFieldVisible("role", values.inquiryType)) {
    validateSingleLine(values.role, FIELD_MAX_LENGTH.role, errors, "role");
  }

  if (isContactFieldVisible("country", values.inquiryType)) {
    const country = values.country.trim();
    if (country !== "" && !/^[A-Za-z]{2}$/.test(country)) {
      errors.country = {key: "invalidCountry"};
    }
  }

  if (
    isContactFieldVisible("stage", values.inquiryType) &&
    values.stage !== "" &&
    !BUSINESS_STAGES.includes(values.stage)
  ) {
    errors.stage = {key: "invalidStage"};
  }

  validateSingleLine(
    values.referralSource,
    FIELD_MAX_LENGTH.referralSource,
    errors,
    "referralSource"
  );

  return errors;
}

export type ContactPayloadOptions = {
  locale: ContactLocale;
  turnstileToken?: string;
};

/**
 * Builds the API payload. Only visible, applicable fields with a value are
 * included: a value kept in a now-hidden field is never sent.
 */
export function buildContactPayload(
  values: ContactFormValues,
  {locale, turnstileToken}: ContactPayloadOptions
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    inquiryType: values.inquiryType,
    fullName: values.fullName,
    email: values.email,
    description: values.description,
    privacyAccepted: values.privacyAccepted === true,
    locale
  };

  const company = values.company.trim();
  if (company !== "") {
    payload.company = values.company;
  }

  const markets = values.markets.trim();
  if (markets !== "") {
    payload.markets = values.markets;
  }

  if (isContactFieldVisible("website", values.inquiryType)) {
    const website = values.website.trim();
    if (website !== "") {
      payload.website = values.website;
    }
  }

  if (isContactFieldVisible("role", values.inquiryType)) {
    const role = values.role.trim();
    if (role !== "") {
      payload.role = values.role;
    }
  }

  if (isContactFieldVisible("country", values.inquiryType)) {
    const country = values.country.trim().toUpperCase();
    if (country !== "") {
      payload.country = country;
    }
  }

  if (isContactFieldVisible("stage", values.inquiryType) && values.stage !== "") {
    payload.stage = values.stage;
  }

  const referralSource = values.referralSource.trim();
  if (referralSource !== "") {
    payload.referralSource = values.referralSource;
  }

  if (turnstileToken) {
    payload.turnstileToken = turnstileToken;
  }

  return payload;
}

/**
 * Maps the API's stable English technical messages to localized UI keys.
 * `max` is recovered from "Must be at most N characters.".
 */
export function mapServerFieldError(message: string): ContactFieldError {
  const maxMatch = /^Must be at most (\d+) characters\.$/.exec(message);
  if (maxMatch) {
    return {key: "tooLong", max: Number(maxMatch[1])};
  }

  switch (message) {
    case "This field is required.":
      return {key: "required"};
    case "Enter a valid email address.":
      return {key: "invalidEmail"};
    case "Line breaks are not allowed.":
      return {key: "lineBreaks"};
    case "You must accept the Privacy Notice.":
      return {key: "privacyRequired"};
    case "Select a valid inquiry type.":
      return {key: "invalidInquiry"};
    case "Use a two-letter country code.":
      return {key: "invalidCountry"};
    case "Not available for this inquiry type.":
      return {key: "notApplicable"};
    case "Unknown field.":
      return {key: "unknownField"};
    case "Invalid value.":
      return {key: "invalidValue"};
    default:
      return {key: "invalidValue"};
  }
}

/**
 * Keeps only field errors the user can act on: known fields that are visible
 * for the current inquiry type. `_form` and unknown keys are ignored because
 * the exact API error message is shown separately.
 */
export function mapServerFieldErrors(
  fieldErrors: Record<string, string>,
  inquiryType: InquiryType | ""
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  for (const [field, message] of Object.entries(fieldErrors)) {
    if (!isContactFieldName(field)) {
      continue;
    }
    if (!isContactFieldVisible(field, inquiryType)) {
      continue;
    }
    errors[field] = mapServerFieldError(message);
  }

  return errors;
}

export function hasContactFormErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Removes errors for fields that the selected inquiry type hides. */
export function filterVisibleErrors(
  errors: ContactFormErrors,
  inquiryType: InquiryType | ""
): ContactFormErrors {
  const next: ContactFormErrors = {};

  for (const [field, error] of Object.entries(errors)) {
    if (field === "turnstile") {
      next.turnstile = error;
      continue;
    }

    if (isContactFieldName(field) && isContactFieldVisible(field, inquiryType)) {
      next[field] = error;
    }
  }

  return next;
}
