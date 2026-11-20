import type {LinkContent, Locale} from "@/content/types";
import {BRAND_DESCRIPTOR} from "@/content/brand";
import {BrandLogo} from "@/components/layout/BrandLogo";
import {ButtonLink} from "./ButtonLink";
import {Container} from "./Container";
import {Emphasis} from "./Emphasis";
import {EnglishTerm} from "./EnglishTerm";
import {Section} from "./Section";

type Props = {
  cta: LinkContent;
  locale: Locale;
  /** With a heading the panel is a full closing statement (Home). */
  heading?: string;
  body?: string;
};

/**
 * Closing call to action on a blue surface. It leads straight into the
 * footer, which starts blue and fades to green, so the page ends on the brand
 * transition.
 *
 * Without a heading (How We Work, where the brief gives only the CTA) the
 * panel is anchored by the dark wordmark and the descriptor as separate text.
 * The descriptor is not baked into the SVG and is tagged as English copy on
 * Spanish pages.
 */
export function CtaPanel({cta, locale, heading, body}: Props) {
  if (heading) {
    return (
      <Section index={false} shapes tone="blue">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
            <div className="min-w-0">
              <h2 className="max-w-[16ch] text-display-1 text-balance">
                <Emphasis text={heading} />
              </h2>
              {body ? (
                <p
                  className="mt-8 max-w-[48ch] text-lead text-pretty text-alva-stone"
                  data-m="reveal"
                >
                  {body}
                </p>
              ) : null}
            </div>
            <div className="flex lg:justify-end" data-m="reveal">
              <ButtonLink href={cta.href} variant="inverse">
                {cta.label}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section index={false} shapes tone="blue">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-8">
          <div className="min-w-0" data-m="reveal">
            <BrandLogo size="large" variant="dark" />
            <p className="mt-4 font-mono text-eyebrow text-alva-stone">
              <EnglishTerm locale={locale}>{BRAND_DESCRIPTOR}</EnglishTerm>
            </p>
          </div>
          <div data-m="reveal">
            <ButtonLink href={cta.href} variant="inverse">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
