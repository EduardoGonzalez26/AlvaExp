import type {HomeContent, Locale} from "@/content/types";
import {BRAND_DESCRIPTOR} from "@/content/brand";
import {BrandLogo} from "@/components/layout/BrandLogo";
import {BrandShapes, Lattice} from "@/components/ui/Backdrop";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {Prose} from "@/components/ui/Prose";

type Props = {
  content: HomeContent["hero"];
  locale: Locale;
};

/**
 * Cover-style hero (brand deck): solid blue with the hairline lattice and
 * the oversized A mark from the logo (ribbon included). The brand gradient
 * runs along the bottom edge, and the title closes in italics. On load the
 * strip and rules are drawn and the content enters in sequence (see
 * PageMotion).
 */
export function Hero({content, locale}: Props) {
  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-var(--spacing-header))] flex-col overflow-x-clip bg-alva-blue pt-[clamp(2.5rem,6svh,5rem)] pb-[clamp(3rem,7svh,5.5rem)] text-alva-paper"
      data-m="hero"
      data-surface="dark"
    >
      <Lattice />
      <BrandShapes className="top-0 right-0" markId="hero" />

      <Container className="flex flex-1 flex-col">
        <div className="grid flex-1 gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="min-w-0 lg:col-span-8 lg:pr-8">
            <div
              className="mb-[clamp(1.5rem,2.5vw,2.25rem)]"
              data-m-i="lockup"
              data-m-pre=""
            >
              <p className="flex items-center gap-4 font-mono text-eyebrow text-alva-stone">
                <span
                  aria-hidden="true"
                  className="h-px w-10 shrink-0 bg-alva-stone"
                  data-m="rule"
                />
                <span>
                  <EnglishTerm locale={locale}>{BRAND_DESCRIPTOR}</EnglishTerm>
                </span>
              </p>
              <BrandLogo
                className="mt-4 block sm:mt-5"
                priority
                size="xl"
                variant="dark"
              />
            </div>
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

            <div className="mt-[clamp(1.5rem,2.5vw,2rem)] flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
              <div className="min-w-0 sm:flex-1" data-m-i="cta" data-m-pre="">
                <ButtonLink
                  className="w-full"
                  href={content.primaryCta.href}
                  size="large"
                  variant="inverse-accent"
                >
                  {content.primaryCta.label}
                </ButtonLink>
              </div>
              <div className="min-w-0 sm:flex-1" data-m-i="cta" data-m-pre="">
                <ButtonLink
                  className="w-full"
                  href={content.secondaryCta.href}
                  size="large"
                  variant="outline-inverse"
                >
                  {content.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 pt-6 lg:col-span-4 lg:pt-8">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-alva-stone"
              data-m="rule"
            />
            <div data-m-i="text" data-m-pre="">
              <Prose locale={locale} paragraphs={content.paragraphs} />
            </div>

            <p
              className="mt-8 border-t border-alva-stone pt-5 font-mono text-eyebrow"
              data-m-i="text"
              data-m-pre=""
            >
              <EnglishTerm locale={locale}>{content.formula}</EnglishTerm>
            </p>
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
