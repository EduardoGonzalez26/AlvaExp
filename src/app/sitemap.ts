import type {MetadataRoute} from "next";
import {routing} from "@/i18n/routing";
import type {RouteHref} from "@/content/types";
import {isSiteIndexable} from "@/lib/indexing";
import {pageUrl} from "@/lib/seo";

/**
 * Only finished, indexable pages belong here. Start a Conversation is complete
 * but stays `noindex` and out of the sitemap until the Privacy Notice page and
 * real email delivery are live (see its page comment). Privacy Notice and
 * Cookie Policy are still placeholders. Add each route here when it is ready
 * to be indexed.
 */
const indexableRoutes: RouteHref[] = [
  "/",
  "/how-we-work",
  "/why-latin-america",
  "/about"
];

/**
 * One entry per language version, each listing the full hreflang cluster
 * (en, es, x-default = en). `lastmod` is omitted on purpose: there is no
 * reliable modification date, and a build timestamp would be misleading.
 *
 * While `SITE_INDEXABLE !== "true"` the sitemap is empty: staging must not
 * advertise URLs even if a crawler ignores robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSiteIndexable()) {
    return [];
  }

  return indexableRoutes.flatMap((href) => {
    const languages = {
      en: pageUrl("en", href),
      es: pageUrl("es", href),
      "x-default": pageUrl("en", href)
    };

    return routing.locales.map((locale) => ({
      url: pageUrl(locale, href),
      alternates: {languages}
    }));
  });
}
