import {cn} from "@/lib/cn";

type Props = {
  className?: string;
};

/**
 * Decorative arrow for links and buttons. It never carries meaning: the
 * label alone describes the action, so the icon is hidden from assistive tech.
 */
export function ArrowIcon({className}: Props) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1",
        className
      )}
      fill="none"
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.25"
      />
    </svg>
  );
}
