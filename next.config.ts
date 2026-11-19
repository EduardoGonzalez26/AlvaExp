import createNextIntlPlugin from "next-intl/plugin";
import type {NextConfig} from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Staging/launch indexing gate. This mirrors src/lib/indexing.ts: next.config
 * is loaded when the app is built/started, so changing SITE_INDEXABLE requires
 * a rebuild and redeploy.
 */
const siteIndexable = process.env.SITE_INDEXABLE === "true";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Report-Only first: violations are reported in the browser console without
 * blocking Next.js inline bootstrap scripts or the app shell. After the
 * reports are clean in production, switch the header to
 * `Content-Security-Policy` and replace `'unsafe-inline'` with nonces/hashes.
 * See docs/launch-checklist.md.
 *
 * Turnstile needs challenges.cloudflare.com for its script, iframe and
 * network requests. Fonts are self-hosted by next/font, so font-src stays
 * 'self'. Images are local assets or data URIs.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'"
].join("; ");

const securityHeaders: {key: string; value: string}[] = [
  {key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy},
  {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
  {key: "X-Content-Type-Options", value: "nosniff"},
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()"
  },
  {key: "X-Frame-Options", value: "DENY"},
  {key: "Cross-Origin-Opener-Policy", value: "same-origin"}
];

if (isProduction) {
  // Production deployments (including Vercel) are served over HTTPS. Local
  // development may use HTTP, so HSTS is only emitted for production builds.
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  });
}

if (!siteIndexable) {
  // Belt-and-braces on top of page metadata and robots.txt: every response,
  // including 404s and API routes, carries the noindex directive while the
  // site is in staging.
  securityHeaders.push({key: "X-Robots-Tag", value: "noindex, nofollow"});
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  /**
   * One canonical URL shape for every page, including Home
   * (https://alvaexpansion.com/). Next.js strips the root trailing slash from
   * metadata unless this is enabled, which made the canonical disagree with
   * the sitemap. next-intl also reads this flag to build localized links.
   */
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default withNextIntl(nextConfig);
