import type {ReactNode} from "react";
import {Link} from "@/i18n/navigation";
import type {RouteHref} from "@/content/types";
import {cn} from "@/lib/cn";
import {ArrowIcon} from "./ArrowIcon";

type Variant = "primary" | "secondary" | "inverse";
type Size = "default" | "small";

type Props = {
  href: RouteHref;
  /** The visible label (the part of the brief's "Label → Destination" before the arrow). */
  children: ReactNode;
  /**
   * primary: blue on paper or stone. secondary: outline. inverse: paper on
   * blue sections (a blue button would disappear there).
   */
  variant?: Variant;
  size?: Size;
  className?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "border-alva-blue bg-alva-blue text-alva-paper hover:border-alva-green hover:bg-alva-green",
  secondary:
    "border-alva-blue bg-transparent text-alva-blue hover:bg-alva-blue hover:text-alva-paper",
  inverse:
    "border-alva-paper bg-alva-paper text-alva-blue hover:border-alva-stone hover:bg-alva-stone"
};

const sizes: Record<Size, string> = {
  default: "min-h-12 gap-6 px-5 py-3 text-ui-sm",
  small: "min-h-11 gap-4 px-4 py-2 text-ui-sm"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "default",
  className
}: Props) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center justify-between border no-underline transition-colors duration-150",
        variants[variant],
        sizes[size],
        className
      )}
      href={href}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}
