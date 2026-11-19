import type {FaqItem, Locale} from "@/content/types";
import {LocalizedText} from "./LocalizedText";

type Props = {
  items: FaqItem[];
  /** Tags English terms that stay in English inside Spanish copy. */
  locale?: Locale;
};

/** Pseudo-element trigger so the icon fills when the whole row is hovered or open. */
const ICON_FILL =
  "group-hover:before:[clip-path:inset(0_0_0_0)] group-open:before:[clip-path:inset(0_0_0_0)] group-focus-within:before:[clip-path:inset(0_0_0_0)]";

/**
 * Accessible accordion built on native <details>/<summary>: keyboard operable
 * (Enter and Space), exposes expanded state to assistive tech and works
 * without JavaScript. Each question is a heading inside its summary.
 *
 * Each item is a rounded row. The round icon fills with the brand gradient
 * from top to bottom on hover and while the item is open.
 */
export function Faq({items, locale}: Props) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          className="group rounded-xl border border-alva-stone bg-alva-paper transition-colors duration-300 open:bg-alva-mist hover:border-alva-blue"
          key={item.question}
        >
          <summary className="flex cursor-pointer items-center justify-between gap-6 rounded-xl px-5 py-5 sm:px-7">
            <h3 className="flex-1 text-question">
              {locale ? (
                <LocalizedText locale={locale} text={item.question} />
              ) : (
                item.question
              )}
            </h3>
            <span
              aria-hidden="true"
              className={`fill-down relative grid size-10 shrink-0 place-items-center rounded-full border border-alva-blue text-alva-blue transition-colors duration-(--duration-fill) ease-(--ease-brand) group-hover:text-alva-paper group-open:text-alva-paper group-focus-within:text-alva-paper ${ICON_FILL}`}
            >
              <span className="relative block size-3.5">
                <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                <span className="absolute inset-x-0 top-1/2 h-px rotate-90 bg-current transition-transform duration-300 group-open:rotate-0" />
              </span>
            </span>
          </summary>
          <div className="max-w-[46rem] px-5 pb-7 sm:px-7 sm:pr-20">
            <p className="text-body">
              {locale ? (
                <LocalizedText locale={locale} text={item.answer} />
              ) : (
                item.answer
              )}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
