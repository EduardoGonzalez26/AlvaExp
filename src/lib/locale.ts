import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import type {Locale} from "@/content/types";

/** Validates a `[locale]` route param and narrows it to a supported locale. */
export function resolveLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) {
    notFound();
  }

  return value;
}
