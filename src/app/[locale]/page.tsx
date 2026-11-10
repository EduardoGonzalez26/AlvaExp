import type {Metadata} from "next";
import {getSiteContent} from "@/content";
import {resolveLocale} from "@/lib/locale";
import {buildPageMetadata} from "@/lib/seo";
import {Approach} from "@/components/home/Approach";
import {Hero} from "@/components/home/Hero";
import {Region} from "@/components/home/Region";
import {Relationships} from "@/components/home/Relationships";
import {SharedVision} from "@/components/home/SharedVision";
import {Team} from "@/components/home/Team";
import {WhyPartner} from "@/components/home/WhyPartner";
import {CtaPanel} from "@/components/ui/CtaPanel";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);

  return buildPageMetadata({
    locale,
    href: "/",
    meta: getSiteContent(locale).home.meta
  });
}

/** Home. Sections follow the brief's order exactly. */
export default async function HomePage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const content = getSiteContent(locale).home;

  return (
    <>
      <Hero content={content.hero} locale={locale} />
      <SharedVision content={content.sharedVision} />
      <WhyPartner content={content.whyPartner} />
      <Region content={content.region} locale={locale} />
      <Approach content={content.approach} locale={locale} />
      <Relationships content={content.relationships} />
      <Team content={content.team} />
      <CtaPanel
        body={content.finalCta.body}
        cta={content.finalCta.cta}
        heading={content.finalCta.heading}
      />
    </>
  );
}
