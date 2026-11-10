/** Brand strings taken from the brief. */
export const BRAND_NAME = "Alva";
export const BRAND_DESCRIPTOR = "Business Expansion Partner";
export const BRAND_LOCKUP = "Alva · Business Expansion Partner";

/** Minimal footer copyright required by the Phase 1 order. */
export const COPYRIGHT = "© 2026 Alva";

/**
 * Replaceable brand assets (all live in /public/brand).
 * - logo.svg: when this file exists, <BrandLogo> uses it; otherwise it falls
 *   back to the typographic wordmark. Rebuild after adding it.
 * - favicon.svg and og-image.png: temporary placeholders. Overwrite them in
 *   place with the approved files (og-image.png must stay 1200 x 630).
 */
export const BRAND_ASSETS = {
  logo: "/brand/logo.svg",
  favicon: "/brand/favicon.svg",
  ogImage: "/brand/og-image.png"
} as const;

export const OG_IMAGE_SIZE = {width: 1200, height: 630} as const;

/** Open Graph locales. Spanish uses es_MX because the team is based in Mexico City. */
export const OG_LOCALES = {en: "en_US", es: "es_MX"} as const;
