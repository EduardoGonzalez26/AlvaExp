import {
  buildContactPayload,
  mapServerFieldErrors,
  type ContactFormErrors,
  type ContactFormValues
} from "./form";

export type SubmitResult =
  | {ok: true}
  | {ok: false; fieldErrors: ContactFormErrors};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Posts the contact payload to the API (same contract as the page form) and
 * maps the response. Field errors come back localized-ready; a network or
 * server failure returns no field errors so the caller shows the general one.
 */
export async function submitContact(
  values: ContactFormValues,
  locale: "en" | "es",
  turnstileToken: string
): Promise<SubmitResult> {
  try {
    // trailingSlash: true makes /api/contact/ the canonical route.
    const response = await fetch("/api/contact/", {
      method: "POST",
      headers: {"content-type": "application/json"},
      credentials: "same-origin",
      body: JSON.stringify(buildContactPayload(values, {locale, turnstileToken}))
    });

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (response.ok && isRecord(body) && body.ok === true) {
      return {ok: true};
    }

    const raw = isRecord(body) && isRecord(body.fieldErrors) ? body.fieldErrors : null;
    const fieldErrors: Record<string, string> = {};
    if (raw) {
      for (const [field, message] of Object.entries(raw)) {
        if (typeof message === "string") fieldErrors[field] = message;
      }
    }

    return {
      ok: false,
      fieldErrors: raw ? mapServerFieldErrors(fieldErrors, values.inquiryType) : {}
    };
  } catch {
    return {ok: false, fieldErrors: {}};
  }
}
