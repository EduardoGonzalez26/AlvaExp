import {getTranslations} from "next-intl/server";
import type {Locale, RouteHref} from "@/content/types";

export type NavKey =
  | "home"
  | "howWeWork"
  | "whyLatinAmerica"
  | "about"
  | "startAConversation"
  | "privacyNotice"
  | "cookiePolicy";

/** Maps each navigation label key to its internal route. */
export const NAV_ROUTES: Record<NavKey, RouteHref> = {
  home: "/",
  howWeWork: "/how-we-work",
  whyLatinAmerica: "/why-latin-america",
  about: "/about",
  startAConversation: "/start-a-conversation",
  privacyNotice: "/privacy-notice",
  cookiePolicy: "/cookie-policy"
};

export type NavItem = {
  key: NavKey;
  label: string;
  href: RouteHref;
};

export type Navigation = {
  /** Header navigation: How We Work, Why Latin America, About Alva. The logo links home. */
  primary: NavItem[];
  /** Header call to action: the "Start a Conversation" page. */
  cta: NavItem;
  /** Footer navigation: Home, the primary items and the call to action page. */
  footer: NavItem[];
  /** Legal links shown in the footer. */
  legal: NavItem[];
};

export async function getNavigation(locale: Locale): Promise<Navigation> {
  const t = await getTranslations({locale, namespace: "Nav"});

  const item = (key: NavKey): NavItem => ({
    key,
    label: t(key),
    href: NAV_ROUTES[key]
  });

  const primary = (
    ["howWeWork", "whyLatinAmerica", "about"] as const
  ).map(item);
  const cta = item("startAConversation");
  const legal = (["privacyNotice", "cookiePolicy"] as const).map(item);
  const footer = [item("home"), ...primary, cta];

  return {primary, cta, footer, legal};
}
