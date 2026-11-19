const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const DEFAULT_TIMEOUT_MS = 5_000;

export type TurnstileVerifyOptions = {
  secretKey: string;
  remoteIp?: string | null;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

type SiteverifyResponse = {
  success?: unknown;
};

/**
 * Verifies a Turnstile token server-side.
 *
 * Any failure (network, timeout, non-2xx, malformed JSON or success=false)
 * returns false. The caller maps false to 403 TURNSTILE_FAILED. Production
 * callers always pass a real secret; development may use Cloudflare's test
 * secret, but no production bypass exists.
 */
export async function verifyTurnstileToken(
  token: string,
  options: TurnstileVerifyOptions
): Promise<boolean> {
  if (!token || !options.secretKey) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );

  try {
    const body = new URLSearchParams({
      secret: options.secretKey,
      response: token
    });

    if (options.remoteIp && options.remoteIp !== "unknown") {
      body.set("remoteip", options.remoteIp);
    }

    const fetchImpl = options.fetchImpl ?? fetch;
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {"content-type": "application/x-www-form-urlencoded"},
      body,
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as SiteverifyResponse;
    return data.success === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
