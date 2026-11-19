import type {HomeContent, Locale} from "@/content/types";
import {BrandShapes, Lattice} from "@/components/ui/Backdrop";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {Prose} from "@/components/ui/Prose";
import Magnet from "@/components/react-bits/Magnet";

type Props = {
  content: HomeContent["hero"];
  locale: Locale;
};

/**
 * Cover-style hero (brand deck): solid blue with the hairline lattice and
 * oversized fragments of the mark. The brand gradient runs along the bottom
 * edge, and the title closes in italics. On load the strip and rules are drawn
 * and the content enters in sequence (see PageMotion).
 */
export function Hero({content, locale}: Props) {
  return (
    <section
      className="relative isolate overflow-x-clip bg-alva-blue pt-[clamp(3.5rem,8vw,7.5rem)] pb-[clamp(4.5rem,9vw,8rem)] text-alva-paper"
      data-m="hero"
      data-surface="dark"
    >
      <Lattice />
      <BrandShapes className="top-0 right-0" />

      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-8">
          <div className="min-w-0 lg:col-span-8 lg:pr-8">
            <p
              className="mb-[clamp(1.75rem,3vw,2.75rem)] flex items-center gap-4 font-mono text-eyebrow text-alva-stone"
              data-m-i="eyebrow"
              data-m-pre=""
            >
              <span
                aria-hidden="true"
                className="h-px w-10 shrink-0 bg-alva-stone"
                data-m="rule"
              />
              {content.eyebrow}
            </p>
            <h1
              className="text-display-1 text-balance"
              data-m-i="title"
              data-m-pre=""
            >
              <Emphasis text={content.title} />
            </h1>
            <p
              className="mt-[clamp(1.75rem,3vw,2.5rem)] max-w-[26ch] text-hero-lead text-pretty text-alva-stone"
              data-m-i="lead"
              data-m-pre=""
            >
              {content.lead}
            </p>
          </div>

          <div className="relative min-w-0 pt-6 lg:col-span-4 lg:flex lg:flex-col lg:justify-end lg:pt-8">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-alva-stone"
              data-m="rule"
            />
            <div data-m-i="text" data-m-pre="">
              <Prose paragraphs={content.paragraphs} />
            </div>

            <p
              className="mt-8 border-t border-alva-stone pt-5 font-mono text-eyebrow"
              data-m-i="text"
              data-m-pre=""
            >
              <EnglishTerm locale={locale}>{content.formula}</EnglishTerm>
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Magnet
                data-m-i="cta"
                data-m-pre=""
                magnetStrength={5}
                maxOffset={10}
                style={{display: "block"}}
              >
                <ButtonLink
                  className="w-full"
                  href={content.primaryCta.href}
                  variant="inverse"
                >
                  {content.primaryCta.label}
                </ButtonLink>
              </Magnet>
              <div data-m-i="cta" data-m-pre="">
                <ButtonLink
                  className="w-full"
                  href={content.secondaryCta.href}
                  variant="outline-inverse"
                >
                  {content.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2 bg-brand-gradient-x"
        data-m="strip"
        data-m-pre=""
      />
    </section>
  );
}
