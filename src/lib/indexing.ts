import type {Metadata} from "next";

/**
 * Indexing gate for staging and production.
 *
 * `SITE_INDEXABLE` is server-side only (it is deliberately not a
 * `NEXT_PUBLIC_*` variable). Pages are statically rendered and metadata,
 * robots.txt and the sitemap are generated during `next build`, so the value
 * is evaluated at build time: changing it requires a rebuild and redeploy.
 * Keep it available at runtime too: dynamic routes (404s) and `next.config`
 * headers read it when the server starts.
 *
 * Only the exact string "true" enables indexing. Missing, "false", "1",
 * "TRUE" or any other value keep the whole site non-indexable.
 */
export function isSiteIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true";
}

/**
 * Robots directives for one page.
 *
 * - `SITE_INDEXABLE !== "true"` (staging): every page is `noindex, nofollow`,
 *   including pages that will be indexable at launch.
 * - `SITE_INDEXABLE === "true"`: a page marked `noindex` keeps its current
 *   behaviour (noindex but follow links); the rest are indexable.
 */
export function buildRobots(noindex = false): Metadata["robots"] {
  if (!isSiteIndexable()) {
    return {index: false, follow: false};
  }

  return noindex ? {index: false, follow: true} : undefined;
}
