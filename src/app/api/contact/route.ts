import {handleContactRequest} from "@/lib/contact/handler";
import {defaultContactDependencies} from "@/lib/contact/runtime";

/**
 * POST /api/contact/
 *
 * Canonical URL: next.config.ts sets `trailingSlash: true`, so Next redirects
 * /api/contact to /api/contact/ with 308. Clients should call the canonical
 * path directly; POST bodies are preserved across 308 redirects anyway.
 *
 * Contract
 * --------
 * Request:  application/json, max 32 KB
 * Success:  200 {ok: true}
 * Error:    4xx/5xx {ok: false, code, fieldErrors?}
 * fieldErrors values are stable English technical messages; the frontend may
 * map them to localized copy.
 *
 * Payload fields
 * --------------
 * Required: inquiryType, fullName, email, description, privacyAccepted (true),
 *           locale, and turnstileToken in production.
 * Optional: company, markets, referralSource (all inquiry types);
 *           website + country (expansion/referral);
 *           role (expansion/collaboration);
 *           stage (expansion only).
 *
 * Conditional fields that do not apply to the selected inquiryType are
 * rejected, not ignored. Unknown fields and wrong JSON types are rejected.
 *
 * Error codes (HTTP status is defined in src/lib/contact/types.ts)
 * ----------------------------------------------------------------
 * INVALID_INPUT 400 | UNSUPPORTED_MEDIA_TYPE 415 | PAYLOAD_TOO_LARGE 413 |
 * METHOD_NOT_ALLOWED 405 | FORBIDDEN_ORIGIN 403 | TURNSTILE_FAILED 403 |
 * RATE_LIMITED 429 | DELIVERY_FAILED 502 | SERVICE_UNAVAILABLE 503
 *
 * Delivery is console-only in development. Production requires Resend and
 * real Turnstile keys; missing configuration or Cloudflare's documented test
 * keys return 503, never a fake success. Responses are always
 * Cache-Control: no-store.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleContactRequest(request, defaultContactDependencies);
}

/*
 * Exporting the other methods keeps the JSON contract consistent for
 * non-POST requests. The handler answers 405 METHOD_NOT_ALLOWED with
 * `Allow: POST` instead of Next's default empty 405.
 */
export async function GET(request: Request): Promise<Response> {
  return handleContactRequest(request, defaultContactDependencies);
}

export async function PUT(request: Request): Promise<Response> {
  return handleContactRequest(request, defaultContactDependencies);
}

export async function PATCH(request: Request): Promise<Response> {
  return handleContactRequest(request, defaultContactDependencies);
}

export async function DELETE(request: Request): Promise<Response> {
  return handleContactRequest(request, defaultContactDependencies);
}

export async function OPTIONS(request: Request): Promise<Response> {
  return handleContactRequest(request, defaultContactDependencies);
}
