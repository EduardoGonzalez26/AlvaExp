/**
 * Single source of truth for the public site origin.
 *
 * `NEXT_PUBLIC_SITE_URL` feeds metadata, canonical URLs, hreflang, Open Graph
 * and the sitemap. It is inlined at build time. When it is unset or empty the
 * fallback below applies; when it is set to something that is not a valid URL
 * the build fails loudly instead of publishing wrong canonical URLs.
 */
const FALLBACK_SITE_URL = "https://alvaexpansion.com";

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return FALLBACK_SITE_URL;
  }

  try {
    return new URL(configured).origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be a valid URL such as https://example.com (received "${configured}").`
    );
  }
}

/** Origin without a trailing slash, for example https://alvaexpansion.com */
export const SITE_URL = resolveSiteUrl();

export const siteUrl = new URL(SITE_URL);

/** Absolute URL for a site path. The root path keeps its trailing slash. */
export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

/**
 * Public contact details shown in the footer. Any empty value is hidden, so
 * nothing renders until real, approved details are added here.
 */
export const contact: {email: string; phone: string} = {
  email: "",
  phone: ""
};
