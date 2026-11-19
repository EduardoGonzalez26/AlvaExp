import {isIP} from "node:net";

type RequestWithIp = Request & {ip?: string};

function normalizeIp(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  // Bracketed IPv6 with an optional port: [2001:db8::1]:443
  let withoutPort = trimmed;
  if (trimmed.startsWith("[")) {
    withoutPort = trimmed.replace(/^\[|\](?::\d+)?$/g, "");
  } else if (trimmed.includes(".") && trimmed.includes(":")) {
    // IPv4 with port: 203.0.113.10:443
    withoutPort = trimmed.replace(/:\d+$/, "");
  }

  return isIP(withoutPort) ? withoutPort.toLowerCase() : null;
}

/**
 * Best-effort client IP extraction for rate limiting.
 *
 * `x-forwarded-for` is the first value, as set by the edge/proxy. It is
 * client-controllable unless the deployment strips it, so this limiter is a
 * defence-in-depth measure only; production must also use Cloudflare/WAF rate
 * limiting. Falls back to `x-real-ip`, then the platform `request.ip`, then the
 * shared "unknown" bucket.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0] ?? "";
    const candidate = normalizeIp(first);
    if (candidate) {
      return candidate;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    const candidate = normalizeIp(realIp);
    if (candidate) {
      return candidate;
    }
  }

  const platformIp = (request as RequestWithIp).ip;
  if (platformIp) {
    const candidate = normalizeIp(platformIp);
    if (candidate) {
      return candidate;
    }
  }

  return "unknown";
}
