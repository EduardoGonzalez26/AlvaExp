import type {Metadata} from "next";
import {getPathname} from "@/i18n/navigation";
import {
  BRAND_ASSETS,
  BRAND_LOCKUP,
  OG_IMAGE_SIZE,
  OG_LOCALES
} from "@/content/brand";
import type {Locale, RouteHref} from "@/content/types";
import {buildRobots} from "./indexing";
import {absoluteUrl, SITE_URL} from "./site";

type PageMetadataInput = {
  locale: Locale;
  href: RouteHref;
  meta: {title: string; description?: string};
  /** Temporary placeholder pages: `noindex`, and they stay out of the sitemap. */
  noindex?: boolean;
};

/**
 * Absolute URL of a page in a given locale, built from NEXT_PUBLIC_SITE_URL.
 *
 * Every page uses the trailing-slash form (next.config `trailingSlash: true`),
 * including Home: https://alvaexpansion.com/. Canonical, hreflang and the
 * sitemap all go through this helper, so they cannot drift apart. Next.js
 * would otherwise drop the trailing slash from the root canonical.
 */
export function pageUrl(locale: Locale, href: RouteHref): string {
  const pathname = getPathname({locale, href});

  return absoluteUrl(pathname.endsWith("/") ? pathname : `${pathname}/`);
}

/**
 * Metadata for one page: title, description, canonical, hreflang
 * (en, es, x-default = en), Open Graph and Twitter card.
 */
export function buildPageMetadata({
  locale,
  href,
  meta,
  noindex = false
}: PageMetadataInput): Metadata {
  const canonical = pageUrl(locale, href);
  const english = pageUrl("en", href);
  const spanish = pageUrl("es", href);
  const ogImage = absoluteUrl(BRAND_ASSETS.ogImage);
  const alternateLocale = locale === "en" ? "es" : "en";

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        en: english,
        es: spanish,
        "x-default": english
      }
    },
    openGraph: {
      type: "website",
      siteName: "Alva",
      title: meta.title,
      description: meta.description,
      url: canonical,
      locale: OG_LOCALES[locale],
      alternateLocale: OG_LOCALES[alternateLocale],
      images: [
        {
          url: ogImage,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: BRAND_LOCKUP
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage]
    },
    robots: buildRobots(noindex)
  };
}
