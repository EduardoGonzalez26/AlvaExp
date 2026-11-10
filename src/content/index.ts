import {en} from "./en";
import {es} from "./es";
import type {Locale, SiteContent} from "./types";

export const siteContent: Record<Locale, SiteContent> = {en, es};

export function getSiteContent(locale: Locale): SiteContent {
  return siteContent[locale];
}
