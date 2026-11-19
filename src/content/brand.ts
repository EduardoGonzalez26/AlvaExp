/** Brand strings taken from the brief. */
export const BRAND_NAME = "Alva";
export const BRAND_DESCRIPTOR = "Business Expansion Partner";
export const BRAND_LOCKUP = "Alva · Business Expansion Partner";

/** Minimal footer copyright required by the Phase 1 order. */
export const COPYRIGHT = "© 2026 Alva";

/**
 * Approved brand assets.
 *
 * Logo palette exception: the approved wordmark uses a blue-to-green gradient
 * in the light variant and pure white in the dark variant. Those colours are
 * part of the supplied artwork, not a change to the interface palette. Never
 * recolour, redraw or vector-trace the logo to force it into the four brand
 * colours; the rest of the UI keeps the strict palette defined in globals.css.
 *
 * Editing notes:
 * - logo.svg is the light-surface wordmark (paper and stone backgrounds).
 * - logo-dark.svg is the dark-surface wordmark (blue backgrounds).
 * - favicon.svg is the blue (#0A3161) icon with the mark in paper (#F4F2EE);
 *   the PNG and ICO files are rendered from it. favicon.ico is mirrored at the
 *   site root (/favicon.ico) so the browser's default request also resolves.
 * - og-image.svg is the editable source of og-image.png (1200 x 630).
 */
export const BRAND_ASSETS = {
  logo: "/brand/logo.svg",
  logoDark: "/brand/logo-dark.svg",
  favicon: "/brand/favicon.svg",
  faviconIco: "/favicon.ico",
  appleIcon: "/brand/apple-icon.png",
  icon32: "/brand/icon-32.png",
  icon192: "/brand/icon-192.png",
  icon512: "/brand/icon-512.png",
  ogImage: "/brand/og-image.png",
  ogImageSource: "/brand/og-image.svg"
} as const;

export const OG_IMAGE_SIZE = {width: 1200, height: 630} as const;

/** Open Graph locales. Spanish uses es_MX because the team is based in Mexico City. */
export const OG_LOCALES = {en: "en_US", es: "es_MX"} as const;
