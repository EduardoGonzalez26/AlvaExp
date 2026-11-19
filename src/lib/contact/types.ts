/**
 * Shared contract types for POST /api/contact/ (canonical trailing-slash URL).
 *
 * The frontend contract is deliberately small:
 *   success -> 200 {ok: true}
 *   error   -> 4xx/5xx {ok: false, code, fieldErrors?}
 *
 * Keep `CONTACT_ERROR_STATUS` as the single source of truth for HTTP status
 * codes; the route handler and the tests both import it.
 */

export const INQUIRY_TYPES = [
  "expansion",
  "referral",
  "collaboration",
  "other"
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const BUSINESS_STAGES = ["early", "growth", "established"] as const;

export type BusinessStage = (typeof BUSINESS_STAGES)[number];

export const CONTACT_LOCALES = ["en", "es"] as const;

export type ContactLocale = (typeof CONTACT_LOCALES)[number];

export const CONTACT_ERROR_STATUS = {
  INVALID_INPUT: 400,
  UNSUPPORTED_MEDIA_TYPE: 415,
  PAYLOAD_TOO_LARGE: 413,
  METHOD_NOT_ALLOWED: 405,
  /** Extra code for the Origin/Referer CSRF-style check (403). */
  FORBIDDEN_ORIGIN: 403,
  TURNSTILE_FAILED: 403,
  RATE_LIMITED: 429,
  DELIVERY_FAILED: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

export type ContactErrorCode = keyof typeof CONTACT_ERROR_STATUS;

/** Machine-friendly field keys. `_form` is used for body-level errors. */
export type ContactFieldErrors = Record<string, string>;

export type ContactSuccessResponse = {ok: true};

export type ContactErrorResponse = {
  ok: false;
  code: ContactErrorCode;
  fieldErrors?: ContactFieldErrors;
};

export type ContactResponse = ContactSuccessResponse | ContactErrorResponse;

export type EmailMode = "console" | "resend";

export type ContactConfig = {
  isProduction: boolean;
  /** `invalid` is kept as a distinct state so configuration fails loudly. */
  emailMode: EmailMode | "invalid";
  resendApiKey: string;
  contactToEmail: string;
  contactFromEmail: string;
  turnstileSecretKey: string;
  turnstileSiteKey: string;
  siteUrl: string;
};

export type ContactConfigIssue =
  | "CONTACT_EMAIL_MODE_INVALID"
  | "CONTACT_EMAIL_MODE_CONSOLE_IN_PRODUCTION"
  | "RESEND_NOT_CONFIGURED"
  | "TURNSTILE_NOT_CONFIGURED"
  | "TURNSTILE_TEST_KEY_IN_PRODUCTION";
