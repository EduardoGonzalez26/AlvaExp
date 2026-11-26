import type {Metadata} from "next";
import {getSiteContent} from "@/content";
import {resolveLocale} from "@/lib/locale";
import {buildPageMetadata} from "@/lib/seo";
import {Connectivity} from "@/components/why-latin-america/Connectivity";
import {Examples} from "@/components/why-latin-america/Examples";
import {HeroStats} from "@/components/why-latin-america/HeroStats";
import {Investment} from "@/components/why-latin-america/Investment";
import {MarketMeaning} from "@/components/why-latin-america/MarketMeaning";
import {RegionScale} from "@/components/why-latin-america/RegionScale";
import {ClosingStatement} from "@/components/ui/ClosingStatement";
import {CtaPanel} from "@/components/ui/CtaPanel";
import {PageHero} from "@/components/ui/PageHero";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);

  return buildPageMetadata({
    locale,
    href: "/why-latin-america",
    meta: getSiteContent(locale).whyLatinAmerica.meta
  });
}

/**
 * Why Latin America. Sections follow the brief's order exactly; the source
 * markers continue one page-wide count (D1 = 1, D2 = 2, D3 = 3, D11 = 4).
 */
export default async function WhyLatinAmericaPage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const content = getSiteContent(locale).whyLatinAmerica;

  return (
    <>
      <PageHero
        locale={locale}
        paragraphs={content.hero.paragraphs}
        signature={<HeroStats sourceNote={content.scale.sourceNote} stats={content.hero.stats} />}
        title={content.hero.title}
      />
      <RegionScale content={content.scale} locale={locale} />
      <MarketMeaning content={content.marketMeaning} />
      <Investment content={content.investment} locale={locale} />
      <Connectivity content={content.connectivity} locale={locale} />
      <Examples content={content.examples} locale={locale} />
      <ClosingStatement
        body={content.finalCta.body}
        heading={content.finalCta.heading}
      />
      <CtaPanel cta={content.finalCta.cta} locale={locale} />
    </>
  );
}
