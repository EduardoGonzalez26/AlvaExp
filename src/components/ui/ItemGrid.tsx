import type {Locale, TitledItem} from "@/content/types";
import {cn} from "@/lib/cn";
import {DiamondIcon} from "./DiamondIcon";
import {LocalizedText} from "./LocalizedText";

type Props = {
  items: TitledItem[];
  /** Two columns suit four items; three suit short explanatory examples. */
  columns?: 2 | 3;
  /** Spanish pages tag English terms inside the copy (WCAG 3.1.2). */
  locale?: Locale;
  /** Surface the grid sits on. Cards take the opposite light tone. */
  tone?: "paper" | "stone";
};

/**
 * Card grid for titled items, after the deck's solution cards: flat stone
 * cards with an outline diamond. On hover (or keyboard focus within) the
 * brand gradient fills the card from top to bottom and the text turns paper.
 */
export function ItemGrid({items, columns = 2, locale, tone = "paper"}: Props) {
  const onStone = tone === "stone";

  return (
    <div
      className={cn(
        "grid gap-4 lg:gap-5",
        columns === 2 ? "sm:grid-cols-2" : "lg:grid-cols-3"
      )}
      data-m="stagger"
    >
      {items.map((item) => (
        <article
          className={cn(
            "group fill-down flex flex-col rounded-xl p-[clamp(1.75rem,3vw,2.75rem)] transition-colors duration-(--duration-fill) ease-(--ease-brand) hover:text-alva-paper",
            onStone ? "bg-alva-paper" : "bg-alva-stone"
          )}
          key={item.title}
        >
          <DiamondIcon
            className={cn(
              "mb-[clamp(2.5rem,5vw,4rem)] transition-colors duration-(--duration-fill) ease-(--ease-brand) group-hover:text-alva-paper",
              onStone ? "text-alva-green" : "text-alva-blue"
            )}
          />
          <h3 className="max-w-[24ch] text-card-title">
            {locale ? (
              <LocalizedText locale={locale} text={item.title} />
            ) : (
              item.title
            )}
          </h3>
          <p className="mt-4 text-body text-pretty">
            {locale ? <LocalizedText locale={locale} text={item.body} /> : item.body}
          </p>
        </article>
      ))}
    </div>
  );
}
