"use client";

import {useEffect, type MouseEvent} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";
import {cn} from "@/lib/cn";
import {BoldOnHover} from "@/components/ui/BoldOnHover";

type Props = {
  className?: string;
  /** "dark" for the footer: paper text, underline on hover. */
  tone?: "light" | "dark";
};

const tones = {
  light: {
    link: "hover:bg-alva-green hover:text-alva-paper focus-visible:bg-alva-green focus-visible:text-alva-paper",
    current: "text-alva-green after:bg-alva-green hover:after:opacity-0 focus-visible:after:opacity-0"
  },
  // Footer (green surface): the pill turns paper and the text green.
  dark: {
    link: "hover:bg-alva-paper hover:text-alva-green focus-visible:bg-alva-paper focus-visible:text-alva-green",
    current: "after:bg-alva-paper hover:after:opacity-0 focus-visible:after:opacity-0"
  }
} as const;

type Locale = (typeof routing.locales)[number];

/** Resolves the running view transition once the new language has rendered. */
let finishTransition: (() => void) | null = null;

/**
 * Language selector. Each option links to the equivalent page in that
 * language (same internal route, localized slug) and updates the language
 * preference cookie. Each accessible name starts with the visible "EN" / "ES"
 * code and then gives the language's own name ("English", "Español"), tagged
 * with `lang` so it is pronounced correctly (WCAG 2.5.3). The current language
 * is announced with `aria-current`.
 *
 * Switching language is animated with the View Transitions API: the page in
 * the new language is revealed from top to bottom (brand direction) over the
 * old one, and the scroll position is kept. Without support, with reduced
 * motion or with a modified click (new tab, etc.) it is a plain link.
 */
export function LocaleSwitcher({className, tone = "light"}: Props) {
  const t = useTranslations("Ui");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // The new language has rendered: let the transition play.
  useEffect(() => {
    finishTransition?.();
    finishTransition = null;
  }, [currentLocale]);

  function switchTo(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    if (
      locale === currentLocale ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    event.preventDefault();
    document.documentElement.setAttribute("data-locale-switch", "");

    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, 2000);
          // Called from the effect once React has committed the new
          // language (no rAF here: rendering is paused during the update).
          finishTransition = () => {
            window.clearTimeout(timeout);
            resolve();
          };
          router.replace(pathname, {locale, scroll: false});
        })
    );

    void transition.finished.finally(() => {
      document.documentElement.removeAttribute("data-locale-switch");
    });
  }

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
                  "group/bold relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 font-mono text-eyebrow no-underline transition-colors duration-300 ease-(--ease-brand)",
                  tones[tone].link,
                  isCurrent &&
                    cn("after:absolute after:inset-x-2 after:bottom-1.5 after:h-0.5", tones[tone].current)
                )}
                href={pathname}
                hrefLang={locale}
                lang={locale}
                locale={locale}
                onClick={(event) => switchTo(event, locale)}
              >
                <BoldOnHover reserve="font-medium" weight="group-hover/bold:font-medium group-focus-visible/bold:font-medium">
                  {locale.toUpperCase()}
                </BoldOnHover>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
