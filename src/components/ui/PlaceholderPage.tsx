import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import type {RouteHref} from "@/content/types";
import {NAV_ROUTES, type NavKey} from "@/lib/nav";
import {resolveLocale} from "@/lib/locale";
import {buildPageMetadata} from "@/lib/seo";
import {Container} from "./Container";
import {Section} from "./Section";

/**
 * TEMPORARY (Phase 1). Minimal stand-in for pages that belong to Phase 2.
 * It shows only the page name (the same label as the menu) and a neutral
 * notice. No brief copy is published here. Each route using it is `noindex`
 * and excluded from the sitemap. Delete this component with the last
 * placeholder route.
 */
type PlaceholderKey = Extract<
  NavKey,
  | "whyLatinAmerica"
  | "about"
  | "startAConversation"
  | "privacyNotice"
  | "cookiePolicy"
>;

type RouteProps = {
  params: Promise<{locale: string}>;
};

/** Page title for a placeholder: its menu label plus the brand, unless the label already has it. */
function placeholderTitle(name: string): string {
  return name.includes("Alva") ? name : `${name} · Alva`;
}

export async function generatePlaceholderMetadata(
  {params}: RouteProps,
  key: PlaceholderKey
): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({locale, namespace: "Nav"});
  const href: RouteHref = NAV_ROUTES[key];

  return buildPageMetadata({
    locale,
    href,
    meta: {title: placeholderTitle(t(key))},
    noindex: true
  });
}

export async function PlaceholderPage({
  params,
  name
}: RouteProps & {name: PlaceholderKey}) {
  const locale = resolveLocale((await params).locale);
  const nav = await getTranslations({locale, namespace: "Nav"});
  const ui = await getTranslations({locale, namespace: "Ui"});

  return (
    <Section className="min-h-[58vh]">
      <Container>
        <h1 className="max-w-[20ch] text-display-2 text-balance">{nav(name)}</h1>
        <p className="mt-6 max-w-xl text-body">{ui("placeholderNotice")}</p>
      </Container>
    </Section>
  );
}
