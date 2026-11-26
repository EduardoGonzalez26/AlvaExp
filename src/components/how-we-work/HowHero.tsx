import type {HowWeWorkContent, Locale} from "@/content/types";
import {PageHero} from "@/components/ui/PageHero";
import {PhaseTrack} from "./PhaseTrack";

type Props = {
  content: HowWeWorkContent["hero"];
  phases: HowWeWorkContent["phases"];
  locale: Locale;
};

export function HowHero({content, phases, locale}: Props) {
  return (
    <PageHero
      locale={locale}
      paragraphs={content.paragraphs}
      signature={<PhaseTrack label={content.phasesLabel} phases={phases} />}
      title={content.title}
    />
  );
}
