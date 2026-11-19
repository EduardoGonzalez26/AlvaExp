function toOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Rejects requests whose Origin and/or Referer are present but do not match
 * the configured public site or the host that received the request.
 *
 * Requests without either header (server-to-server, curl, some privacy
 * browsers) are allowed: this check complements, but does not replace,
 * Turnstile and the WAF.
 */
export function isRequestOriginAllowed(
  request: Request,
  siteUrl: string
): boolean {
  const allowed = new Set<string>();

  const configuredOrigin = toOrigin(siteUrl);
  if (configuredOrigin) {
    allowed.add(configuredOrigin);
  }

  const requestOrigin = toOrigin(request.url);
  if (requestOrigin) {
    allowed.add(requestOrigin);
  }

  const originHeader = request.headers.get("origin");
  if (originHeader !== null) {
    const origin = toOrigin(originHeader);
    if (!origin || !allowed.has(origin)) {
      return false;
    }
  }

  const refererHeader = request.headers.get("referer");
  if (refererHeader !== null) {
    const referer = toOrigin(refererHeader);
    if (!referer || !allowed.has(referer)) {
      return false;
    }
  }

  return true;
}
