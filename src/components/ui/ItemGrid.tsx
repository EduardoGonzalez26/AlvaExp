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
 * cards with an outline diamond, a mono index and a blue to green hairline on
 * the top edge (drawn from the left as the card enters). On hover the card
 * behaves like a folder (see .folder): it lifts, a green tab rises behind it,
 * the top-right corner folds over and the diamond becomes a filled square.
 */
export function ItemGrid({items, columns = 2, locale, tone = "paper"}: Props) {
  const onStone = tone === "stone";

  return (
    <ul
      className={cn(
        "grid gap-4 lg:gap-5",
        columns === 2 ? "sm:grid-cols-2" : "lg:grid-cols-3"
      )}
      data-m="stagger"
    >
      {items.map((item, index) => (
        <li
          className="group folder flex flex-col p-[clamp(1.75rem,3vw,2.5rem)]"
          key={item.title}
        >
          <span
            aria-hidden="true"
            className="folder-tab left-[clamp(1.75rem,3vw,2.5rem)] w-24 bg-alva-green"
          />
          <span
            aria-hidden="true"
            className={cn("folder-surface", onStone ? "bg-alva-paper" : "bg-alva-stone")}
          />
          <span aria-hidden="true" className="folder-flap bg-brand-gradient" />
          <span
            aria-hidden="true"
            className="absolute inset-x-[clamp(1.75rem,3vw,2.5rem)] top-0 h-0.5 bg-brand-gradient-x"
            data-m="card-rule"
          />
          <div
            aria-hidden="true"
            className="mb-[clamp(1.75rem,3.5vw,2.75rem)] flex items-center justify-between"
          >
            {/* The outline diamond turns into a filled green square. */}
            <DiamondIcon
              className={cn(
                "transition-[rotate,scale,color] duration-[420ms] ease-(--ease-brand) group-hover:scale-75 group-hover:rotate-45 group-hover:text-alva-green [&_path]:transition-[fill] [&_path]:duration-[420ms] group-hover:[&_path]:fill-current",
                onStone ? "text-alva-green" : "text-alva-blue"
              )}
            />
            <span className="font-mono text-eyebrow transition-colors duration-300 group-hover:text-alva-green">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
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
        </li>
      ))}
    </ul>
  );
}
