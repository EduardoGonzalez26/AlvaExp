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
  /** Header navigation: Home, How We Work, Why Latin America, About Alva. */
  primary: NavItem[];
  /** Header call to action: the "Start a Conversation" page. */
  cta: NavItem;
  /** Footer navigation: primary items plus the call to action page. */
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
    ["home", "howWeWork", "whyLatinAmerica", "about"] as const
  ).map(item);
  const cta = item("startAConversation");
  const legal = (["privacyNotice", "cookiePolicy"] as const).map(item);

  return {primary, cta, footer: [...primary, cta], legal};
}
