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
        At the very top: a full-width, square bar. Once the page scrolls it
        turns into a floating capsule (see .header-bar in globals.css). Both
        states have the same height. The reading progress line runs along its
        bottom edge.
      */}
      <header className="pointer-events-none sticky top-0 z-50 transition-[padding] duration-(--duration-fill) ease-(--ease-brand) scrolled:pt-3">
        <div className="header-bar pointer-events-auto relative mx-auto border-b border-alva-stone bg-alva-paper scrolled:rounded-full scrolled:border">
          <div className="mx-auto flex min-h-[4.5rem] max-w-page items-center justify-between gap-6 px-gutter transition-[min-height,padding] duration-(--duration-fill) ease-(--ease-brand) scrolled:min-h-[59px] scrolled:py-1.5 scrolled:pr-2 scrolled:pl-5 lg:min-h-20 lg:scrolled:min-h-[67px] lg:scrolled:pl-7">
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
              <ButtonLink className="rounded-full!" href={navigation.cta.href} size="small">
                {t("headerCta")}
              </ButtonLink>
            </div>

            <MobileNav cta={navigation.cta} items={navigation.primary} />
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden transition-[left,right] duration-(--duration-fill) scrolled:inset-x-8 scrolled:rounded-full"
          >
            <span className="reading-progress block h-full w-full bg-brand-gradient-x" />
          </span>
        </div>
      </header>
    </>
  );
}
