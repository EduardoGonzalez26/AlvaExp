import type {Metadata} from "next";
import {getSiteContent} from "@/content";
import {resolveLocale} from "@/lib/locale";
import {buildPageMetadata} from "@/lib/seo";
import {AboutTeam} from "@/components/about/AboutTeam";
import {Partnership} from "@/components/about/Partnership";
import {WhatWeBring} from "@/components/about/WhatWeBring";
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
    href: "/about",
    meta: getSiteContent(locale).about.meta
  });
}

/** About Alva. Sections follow the brief's order exactly. */
export default async function AboutPage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const content = getSiteContent(locale).about;

  return (
    <>
      <PageHero locale={locale} paragraphs={content.hero.paragraphs} title={content.hero.title} />
      <WhatWeBring content={content.together} />
      <Partnership content={content.partnership} />
      <AboutTeam content={content.team} locale={locale} />
      <ClosingStatement
        body={content.working.body}
        bordered
        heading={content.working.heading}
      />
      <CtaPanel cta={content.working.cta} locale={locale} />
    </>
  );
}
