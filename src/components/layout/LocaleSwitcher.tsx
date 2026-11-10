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
 * preference cookie. Accessible names are the language's own name
 * ("English", "Español"), tagged with `lang`, so they are pronounced
 * correctly and contain the visible "EN" / "ES" text (WCAG 2.5.3). The
 * current language is announced with `aria-current`.
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
      <ul className="flex items-center">
        {routing.locales.map((locale, index) => {
          const isCurrent = locale === currentLocale;

          return (
            <li className="flex items-center" key={locale}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-1 h-4 w-px bg-alva-stone"
                />
              ) : null}
              <Link
                aria-current={isCurrent ? "true" : undefined}
                aria-label={names[locale]}
                className={cn(
                  "inline-flex min-h-11 min-w-9 items-center justify-center px-1.5 text-ui-sm tracking-[0.12em] no-underline transition-colors duration-150 hover:text-alva-green",
                  isCurrent &&
                    "underline decoration-alva-green decoration-2 underline-offset-[0.45em]"
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
