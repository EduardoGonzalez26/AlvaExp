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

/**
 * Home. Sections follow the brief's order exactly. They are grouped into the
 * faces of the desktop box scroll (see boxScroll in @/lib/motion/animations): the navy
 * backdrop shows in the wedges the tilted faces open. Without motion the
 * wrappers are plain blocks and the backdrop stays covered.
 */
export default async function HomePage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const content = getSiteContent(locale).home;

  const sections = [
    <Hero content={content.hero} key="hero" locale={locale} />,
    <SharedVision content={content.sharedVision} key="shared-vision" />,
    <WhyPartner content={content.whyPartner} key="why-partner" />,
    <Region content={content.region} key="region" locale={locale} />,
    <Approach content={content.approach} key="approach" locale={locale} />,
    <Relationships content={content.relationships} key="relationships" />,
    <Team content={content.team} key="team" locale={locale} />,
    <CtaPanel
      body={content.finalCta.body}
      cta={content.finalCta.cta}
      heading={content.finalCta.heading}
      key="cta"
      locale={locale}
    />
  ];

  // Sections that tilt away into the next one. Sections between two hinges
  // share one face, so they turn together as a single side of the box while
  // staying separate sections.
  const hinges = new Set(["hero", "why-partner", "region", "team"]);
  const faces: (typeof sections)[] = [[]];

  sections.forEach((section, index) => {
    faces[faces.length - 1]!.push(section);

    if (index < sections.length - 1 && hinges.has(String(section.key))) {
      faces.push([]);
    }
  });

  return (
    <div className="bg-alva-navy" data-m="box-scroll">
      {faces.map((group, index) => (
        <div
          data-box-in={index > 0 ? "" : undefined}
          data-box-out={index < faces.length - 1 ? "" : undefined}
          data-m="box-face"
          key={String(group[0]!.key)}
        >
          {/* Hinge of the outgoing tilt (see boxScroll). */}
          <div>{group}</div>
        </div>
      ))}
    </div>
  );
}
