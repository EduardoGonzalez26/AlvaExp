import type {MetadataRoute} from "next";
import {isSiteIndexable} from "@/lib/indexing";
import {absoluteUrl} from "@/lib/site";

/**
 * Staging is closed to crawlers by default. The gate is server-side and is
 * evaluated at build time; see src/lib/indexing.ts.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexable()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
