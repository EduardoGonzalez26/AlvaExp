import type {MetadataRoute} from "next";
import {routing} from "@/i18n/routing";
import type {RouteHref} from "@/content/types";
import {pageUrl} from "@/lib/seo";

/**
 * Only finished, indexable pages belong here. The temporary placeholder pages
 * (Why Latin America, About Alva, Start a Conversation, Privacy Notice and
 * Cookie Policy) are `noindex` and intentionally excluded until Phase 2.
 * Add each route here when its page is finished and `noindex` is removed.
 */
const indexableRoutes: RouteHref[] = ["/", "/how-we-work"];

/**
 * One entry per language version, each listing the full hreflang cluster
 * (en, es, x-default = en). `lastmod` is omitted on purpose: there is no
 * reliable modification date, and a build timestamp would be misleading.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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
