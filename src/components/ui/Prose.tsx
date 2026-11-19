import type {Locale} from "@/content/types";
import {cn} from "@/lib/cn";
import ScrollReveal from "@/components/react-bits/ScrollReveal";
import {LocalizedText} from "./LocalizedText";

type Props = {
  paragraphs: string[];
  /** Render the first paragraph larger, as an introduction. */
  leadFirst?: boolean;
  className?: string;
  /** Tags English terms that stay in English inside Spanish copy. */
  locale?: Locale;
  /**
   * The lead paragraph (with leadFirst) is revealed word by word as it scrolls
   * into view (React Bits ScrollReveal), and the rest rise in. Plain text only,
   * so it is skipped when `locale` is given.
   */
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

        if (scrollReveal && lead && !locale) {
          return (
            <ScrollReveal as="p" key={paragraph} textClassName={textClass}>
              {paragraph}
            </ScrollReveal>
          );
        }

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
