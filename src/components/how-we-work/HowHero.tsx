import type {HowWeWorkContent, Locale} from "@/content/types";
import {PageHero} from "@/components/ui/PageHero";

type Props = {
  content: HowWeWorkContent["hero"];
  locale: Locale;
};

export function HowHero({content, locale}: Props) {
  return (
    <PageHero
      locale={locale}
      paragraphs={content.paragraphs}
      title={content.title}
    />
  );
}
