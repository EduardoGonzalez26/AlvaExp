"use client";

import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";
import {cn} from "@/lib/cn";

type Props = {
  className?: string;
};

/**
 * Language selector. Each option links to the equivalent page in that
 * language (same internal route, localized slug) and updates the language
 * preference cookie. Each accessible name starts with the visible "EN" / "ES"
 * code and then gives the language's own name ("English", "Español"), tagged
 * with `lang` so it is pronounced correctly (WCAG 2.5.3). The current language
 * is announced with `aria-current`.
 */
export function LocaleSwitcher({className}: Props) {
  const t = useTranslations("Ui");
  const currentLocale = useLocale();
  const pathname = usePathname();

  const names = {
    en: t("languageEnglish"),
    es: t("languageSpanish")
  } as const;

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex items-center gap-0.5">
        {routing.locales.map((locale, index) => {
          const isCurrent = locale === currentLocale;

          return (
            <li className="flex items-center" key={locale}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-0.5 h-4 w-px bg-alva-stone"
                />
              ) : null}
              <Link
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`${locale.toUpperCase()} · ${names[locale]}`}
                className={cn(
                  "fill-down relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 font-mono text-eyebrow no-underline transition-colors duration-(--duration-fill) ease-(--ease-brand) hover:text-alva-paper focus-visible:text-alva-paper",
                  isCurrent &&
                    "after:absolute after:inset-x-2 after:bottom-1.5 after:h-0.5 after:bg-brand-gradient-x hover:after:opacity-0"
                )}
                href={pathname}
                hrefLang={locale}
                lang={locale}
                locale={locale}
              >
                {locale.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
