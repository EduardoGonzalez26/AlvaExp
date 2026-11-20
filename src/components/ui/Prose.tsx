import type {Locale} from "@/content/types";
import {cn} from "@/lib/cn";
import {LocalizedText} from "./LocalizedText";

type Props = {
  paragraphs: string[];
  /** Render the first paragraph larger, as an introduction. */
  leadFirst?: boolean;
  className?: string;
  /** Tags English terms that stay in English inside Spanish copy. */
  locale?: Locale;
  /** Each paragraph fades up as it scrolls into view. */
  scrollReveal?: boolean;
};

/** A stack of body paragraphs with the site's reading measure and rhythm. */
export function Prose({
  paragraphs,
  leadFirst = false,
  className,
  locale,
  scrollReveal = false
}: Props) {
  return (
    <div className={cn("grid gap-5", className)}>
      {paragraphs.map((paragraph, index) => {
        const lead = leadFirst && index === 0;
        const textClass = lead ? "text-lead text-pretty" : "text-body text-pretty";

        return (
          <p
            className={textClass}
            data-m={scrollReveal ? "reveal" : undefined}
            key={paragraph}
          >
            {locale ? (
              <LocalizedText locale={locale} text={paragraph} />
            ) : (
              paragraph
            )}
          </p>
        );
      })}
    </div>
  );
}
