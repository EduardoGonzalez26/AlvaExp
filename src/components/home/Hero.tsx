import type {HomeContent, Locale} from "@/content/types";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {Container} from "@/components/ui/Container";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {Prose} from "@/components/ui/Prose";

type Props = {
  content: HomeContent["hero"];
  locale: Locale;
};

export function Hero({content, locale}: Props) {
  return (
    <section className="pt-[clamp(3.5rem,8vw,7.5rem)] pb-section">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-8">
          <div className="min-w-0 lg:col-span-8 lg:pr-8">
            <p className="mb-[clamp(1.5rem,3vw,2.5rem)] text-eyebrow text-alva-green">
              {content.eyebrow}
            </p>
            <h1 className="text-display-1 text-balance">{content.title}</h1>
            <p className="mt-[clamp(1.75rem,3vw,2.5rem)] max-w-[26ch] text-hero-lead text-pretty">
              {content.lead}
            </p>
          </div>

          <div className="min-w-0 border-t border-alva-stone pt-6 lg:col-span-4 lg:flex lg:flex-col lg:justify-end lg:pt-8">
            <Prose paragraphs={content.paragraphs} />

            <p className="mt-8 border-t border-alva-stone pt-5 text-ui tracking-[0.12em]">
              <EnglishTerm locale={locale}>{content.formula}</EnglishTerm>
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <ButtonLink href={content.primaryCta.href}>
                {content.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={content.secondaryCta.href} variant="secondary">
                {content.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
