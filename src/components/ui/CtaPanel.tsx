import type {LinkContent} from "@/content/types";
import {BRAND_LOCKUP} from "@/content/brand";
import {ButtonLink} from "./ButtonLink";
import {Container} from "./Container";
import {Section} from "./Section";

type Props = {
  cta: LinkContent;
  /** With a heading the panel is a full closing statement (Home). */
  heading?: string;
  body?: string;
};

/**
 * Closing call to action on a blue surface.
 *
 * Without a heading (How We Work, where the brief gives only the CTA) the
 * panel is anchored by the brand lockup, which is existing brand text and not
 * new copy.
 */
export function CtaPanel({cta, heading, body}: Props) {
  if (heading) {
    return (
      <Section tone="blue">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
            <div className="min-w-0">
              <h2 className="text-display-2 text-balance">{heading}</h2>
              {body ? (
                <p className="mt-6 max-w-[48ch] text-lead text-pretty text-alva-stone">
                  {body}
                </p>
              ) : null}
            </div>
            <div className="flex lg:justify-end">
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
    <Section tone="blue">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-8">
          <p className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-light leading-tight tracking-[-0.025em]">
            {BRAND_LOCKUP}
          </p>
          <ButtonLink href={cta.href} variant="inverse">
            {cta.label}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
