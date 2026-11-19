import {cn} from "@/lib/cn";

/**
 * Outline diamond from the brand decks. Decorative: it never carries meaning,
 * so it is hidden from assistive tech. It inherits the text color.
 */
export function DiamondIcon({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-10 shrink-0", className)}
      fill="none"
      focusable="false"
      viewBox="0 0 40 40"
    >
      <path
        d="M20 3.5 36.5 20 20 36.5 3.5 20Z"
        stroke="currentColor"
        strokeLinejoin="miter"
        strokeWidth="1.5"
      />
    </svg>
  );
}
