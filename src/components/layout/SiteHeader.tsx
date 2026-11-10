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

type Props = {
  locale: Locale;
};

/**
 * Site header. From 1024 px: logo, primary navigation, language selector and
 * the "Start a Conversation" call to action. Below that, a disclosure menu.
 */
export async function SiteHeader({locale}: Props) {
  const navigation = await getNavigation(locale);
  const t = await getTranslations({locale, namespace: "Ui"});

  return (
    <header className="relative z-50 border-b border-alva-stone bg-alva-paper">
      <Container className="flex min-h-[4.5rem] items-center justify-between gap-6 lg:min-h-20">
        <Link
          aria-label={t("homeLink")}
          className="inline-flex min-h-11 items-center no-underline"
          href="/"
        >
          <BrandLogo />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-7 lg:flex">
          <PrimaryNav items={navigation.primary} label={t("primaryNavigation")} />
          <LocaleSwitcher />
          <ButtonLink href={navigation.cta.href} size="small">
            {navigation.cta.label}
          </ButtonLink>
        </div>

        <MobileNav cta={navigation.cta} items={navigation.primary} />
      </Container>
    </header>
  );
}
