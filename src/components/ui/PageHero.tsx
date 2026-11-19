import type {Locale} from "@/content/types";
import {BrandShapes, Lattice} from "./Backdrop";
import {Container} from "./Container";
import {Emphasis} from "./Emphasis";
import {Prose} from "./Prose";

type Props = {
  title: string;
  paragraphs: string[];
  /** Tags English terms that stay in English inside Spanish copy. */
  locale?: Locale;
};

/**
 * Opening statement for interior pages, in the style of the deck covers: a
 * blue surface with the hairline lattice and oversized fragments of the mark,
 * the title in serif with an italic closing phrase, and the brand gradient as
 * a strip along the bottom edge. Stacks with the title first on small screens.
 * On load the strip and rule are drawn and the content enters in sequence
 * (see PageMotion).
 */
export function PageHero({title, paragraphs, locale}: Props) {
  return (
    <section
      className="relative isolate overflow-x-clip bg-alva-blue pt-[clamp(3.5rem,7vw,6.5rem)] pb-[clamp(4rem,8vw,7rem)] text-alva-paper"
      data-m="hero"
      data-surface="dark"
    >
      <Lattice />
      <BrandShapes className="top-0 right-0 hidden md:block" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <h1
            className="min-w-0 text-display-1 text-balance lg:col-span-7 lg:pr-8"
            data-m-i="title"
            data-m-pre=""
          >
            <Emphasis text={title} />
          </h1>

          <div className="relative min-w-0 pt-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-alva-stone"
              data-m="rule"
            />
            <div data-m-i="text" data-m-pre="">
              <Prose leadFirst locale={locale} paragraphs={paragraphs} />
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
