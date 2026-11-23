import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/content/types";
import {getNavigation} from "@/lib/nav";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {BrandLogo} from "./BrandLogo";
import {HeaderScrollState} from "./HeaderScrollState";
import {LocaleSwitcher} from "./LocaleSwitcher";
import {MobileNav} from "./MobileNav";
import {PrimaryNav} from "./PrimaryNav";
import {TopRibbon} from "./TopRibbon";

type Props = {
  locale: Locale;
};

/**
 * Site header. From 1024 px: logo, primary navigation, language selector and
 * the "Talk to Alva" call to action. Below that, a disclosure menu. The header
 * CTA uses the editorial CTA label; the page itself stays "Start a
 * Conversation" in the navigation and footer.
 */
export async function SiteHeader({locale}: Props) {
  const navigation = await getNavigation(locale);
  const t = await getTranslations({locale, namespace: "Ui"});

  return (
    <>
      <TopRibbon />
      <HeaderScrollState />
      {/*
        At the very top: a full-width, square bar. As the page scrolls it
        morphs, with the scroll, into a floating capsule (see .header-bar in
        globals.css); scrolling back up reverses it. The total height never
        changes. The reading progress line runs along its bottom edge.
      */}
      <header className="header-strip pointer-events-none sticky top-0 z-50">
        <div className="header-bar pointer-events-auto relative mx-auto bg-alva-paper">
          <div className="header-inner mx-auto flex max-w-page items-center justify-between gap-6">
            <Link
              aria-label={t("homeLink")}
              className="inline-flex min-h-11 items-center rounded-full no-underline"
              href="/"
            >
              <BrandLogo priority variant="light" />
            </Link>

            <div className="hidden flex-1 items-center justify-end gap-5 lg:flex">
              <PrimaryNav items={navigation.primary} label={t("primaryNavigation")} />
              <span aria-hidden="true" className="h-6 w-px bg-alva-stone" />
              <LocaleSwitcher />
              <ButtonLink className="rounded-full!" href={navigation.cta.href} size="small" solidHover>
                {t("headerCta")}
              </ButtonLink>
            </div>

            <MobileNav cta={navigation.cta} items={navigation.primary} />
          </div>

          <span
            aria-hidden="true"
            className="header-progress pointer-events-none absolute -bottom-px h-0.5 overflow-hidden"
          >
            <span className="reading-progress block h-full w-full bg-brand-gradient-x" />
          </span>
        </div>
      </header>
    </>
  );
}
