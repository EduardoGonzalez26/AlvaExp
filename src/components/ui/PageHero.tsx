import type {ReactNode} from "react";
import type {Locale} from "@/content/types";
import {cn} from "@/lib/cn";
import {BrandShapes, Lattice} from "./Backdrop";
import {Container} from "./Container";
import {Emphasis} from "./Emphasis";
import {Prose} from "./Prose";

type Props = {
  title: string;
  paragraphs: string[];
  /** Tags English terms that stay in English inside Spanish copy. */
  locale?: Locale;
  /** Page-specific visual shown under the title and lead, above the fold. */
  signature?: ReactNode;
};

/**
 * Opening statement for interior pages, in the style of the deck covers: a
 * blue surface with the hairline lattice and the oversized A from the logo,
 * the title in serif with an italic closing phrase and an optional highlighted
 * word, the lead beside it on desktop, and the brand gradient as a strip along
 * the bottom edge. Stacks with the title first on small screens. On load the
 * strip and rule are drawn and the content enters in sequence (see PageMotion).
 */
export function PageHero({title, paragraphs, locale, signature: signatureNode}: Props) {
  const signature = signatureNode != null;

  return (
    <section
      className={cn(
        "relative isolate overflow-x-clip bg-alva-blue pt-[clamp(3.5rem,7vw,6.5rem)] pb-[clamp(4rem,8vw,7rem)] text-alva-paper",
        // With a signature the hero fills the first screen on desktop: title,
        // lead and signature are sized against the viewport height so all
        // three stay above the fold, and it grows instead of clipping. The
        // height discounts the TopRibbon (lg:h-9) and the header's border.
        signature &&
          "lg:flex lg:min-h-[calc(100svh-var(--spacing-header)-2.25rem-2px)] lg:flex-col lg:pt-[clamp(1.5rem,5svh,4.5rem)] lg:pb-[clamp(1.75rem,5.5svh,5rem)]"
      )}
      data-m="hero"
      data-surface="dark"
    >
      <Lattice />
      <BrandShapes className="top-0 right-0 hidden md:block" markId="page" />

      <Container className={cn(signature && "lg:flex lg:flex-1 lg:flex-col")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <h1
            className={cn(
              "min-w-0 text-display-1 text-balance lg:self-center",
              signature
                ? "lg:col-span-6 lg:text-[length:min(6.8vw,9.5svh,6.25rem)] 2xl:col-span-7"
                : "lg:col-span-9"
            )}
            data-m-i="title"
            data-m-pre=""
          >
            <Emphasis text={title} />
          </h1>

          <div
            className={cn(
              "relative min-w-0 pt-6 lg:self-end",
              signature
                ? "lg:col-span-6 lg:col-start-7 lg:pt-[clamp(1rem,2.5svh,1.5rem)] lg:pl-[6%] 2xl:col-span-5 2xl:col-start-8 2xl:pl-0"
                : "lg:col-span-3 lg:col-start-10"
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-alva-stone"
              data-m="rule"
            />
            <div data-m-i="text" data-m-pre="">
              <Prose
                className={cn(
                  signature &&
                    "lg:gap-[clamp(0.75rem,2svh,1.25rem)] lg:[&>p:first-child]:text-[length:min(var(--text-lead),3svh)]"
                )}
                leadFirst
                locale={locale}
                paragraphs={paragraphs}
              />
            </div>
          </div>
        </div>

        {signature ? (
          <div
            className="mt-12 lg:mt-auto lg:pt-[clamp(1.25rem,4svh,4rem)]"
            data-m-i="signature"
            data-m-pre=""
          >
            {signatureNode}
          </div>
        ) : null}
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
