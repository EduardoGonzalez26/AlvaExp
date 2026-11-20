import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/content/types";
import {getNavigation} from "@/lib/nav";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {Container} from "@/components/ui/Container";
import {BrandLogo} from "./BrandLogo";
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
      <header className="sticky top-0 z-50 border-b border-alva-stone bg-alva-paper">
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-6 lg:min-h-20">
          <Link
            aria-label={t("homeLink")}
            className="inline-flex min-h-11 items-center no-underline"
            href="/"
          >
            <BrandLogo priority variant="light" />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-7 lg:flex">
            <PrimaryNav items={navigation.primary} label={t("primaryNavigation")} />
            <LocaleSwitcher />
            <ButtonLink href={navigation.cta.href} size="small">
              {t("headerCta")}
            </ButtonLink>
          </div>

          <MobileNav cta={navigation.cta} items={navigation.primary} />
        </Container>
        <span
          aria-hidden="true"
          className="reading-progress pointer-events-none absolute inset-x-0 -bottom-px h-0.5 bg-brand-gradient-x"
        />
      </header>
    </>
  );
}
