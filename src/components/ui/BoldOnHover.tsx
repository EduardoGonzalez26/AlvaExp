import type {ReactNode} from "react";

/**
 * Label that turns bold when its link is hovered or focused, without moving
 * anything around it: an invisible bold copy reserves the final width, and
 * the visible text animates its weight on top (smooth with variable fonts).
 * The parent link must carry the `group/bold` class.
 */
export function BoldOnHover({
  children,
  weight = "group-hover/bold:font-bold group-focus-visible/bold:font-bold",
  reserve = "font-bold"
}: {
  children: ReactNode;
  /** Classes applied on hover/focus (the target weight). */
  weight?: string;
  /** Same weight, for the invisible copy that reserves the width. */
  reserve?: string;
}) {
  return (
    <span className="inline-grid">
      <span
        aria-hidden="true"
        className={`invisible col-start-1 row-start-1 select-none ${reserve}`}
      >
        {children}
      </span>
      <span
        className={`col-start-1 row-start-1 text-center transition-[font-weight] duration-300 ease-(--ease-brand) ${weight}`}
      >
        {children}
      </span>
    </span>
  );
}
