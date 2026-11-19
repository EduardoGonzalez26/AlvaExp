import {TURNSTILE_TEST_SITE_KEY} from "./config";

/**
 * Resolves the public Turnstile site key used by the form widget.
 *
 * - Configured value: used as is.
 * - Development/test without a value: Cloudflare's documented test site key
 *   (`1x00000000000000000000AA`). It is for local development only and must
 *   never be used in production.
 * - Production without a value: `null`. The form shows a controlled
 *   verification error and refuses to submit; the API also answers 503.
 *
 * Server-only: the page passes the resolved value to the Client Component.
 */
export function getTurnstileSiteKey(
  env: NodeJS.ProcessEnv = process.env
): string | null {
  const configured = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (configured) {
    return configured;
  }

  if (env.NODE_ENV !== "production") {
    return TURNSTILE_TEST_SITE_KEY;
  }

  return null;
}
