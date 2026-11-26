import type {Metadata} from "next";
import {getSiteContent} from "@/content";
import {resolveLocale} from "@/lib/locale";
import {buildPageMetadata} from "@/lib/seo";
import {ConnectedTeam} from "@/components/how-we-work/ConnectedTeam";
import {FaqSection} from "@/components/how-we-work/FaqSection";
import {HowHero} from "@/components/how-we-work/HowHero";
import {Phases} from "@/components/how-we-work/Phases";
import {CtaPanel} from "@/components/ui/CtaPanel";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);

  return buildPageMetadata({
    locale,
    href: "/how-we-work",
    meta: getSiteContent(locale).howWeWork.meta
  });
}

/** How We Work: intro, Validate (3 steps), Build, Scale, team, FAQ, CTA. */
export default async function HowWeWorkPage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const content = getSiteContent(locale).howWeWork;

  return (
    <>
      <HowHero content={content.hero} locale={locale} phases={content.phases} />
      <Phases locale={locale} phases={content.phases} />
      <ConnectedTeam content={content.connected} />
      <FaqSection content={content.faq} locale={locale} />
      <CtaPanel cta={content.finalCta} locale={locale} />
    </>
  );
}
