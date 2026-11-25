import type {ReactNode} from "react";
import {Link} from "@/i18n/navigation";
import type {RouteHref} from "@/content/types";
import {cn} from "@/lib/cn";
import {ArrowIcon} from "./ArrowIcon";

type Variant =
  | "primary"
  | "secondary"
  | "inverse"
  | "inverse-accent"
  | "outline-inverse";
type Size = "default" | "large" | "small";

type Props = {
  href: RouteHref;
  /** The visible label (the part of the brief's "Label → Destination" before the arrow). */
  children: ReactNode;
  /**
   * primary: blue on paper or stone. secondary: outline. inverse and
   * outline-inverse: paper on blue and gradient sections (a blue button would
   * disappear there). inverse-accent keeps the paper block but sets the label
   * and arrow in brand green until the hover/focus gradient arrives. Every
   * variant fills with the brand gradient from top to bottom on hover and
   * keyboard focus (see .fill-down).
   */
  variant?: Variant;
  size?: Size;
  /**
   * Solid hover: instead of the gradient wipe, the button turns plain Alva
   * green (used by the header call to action).
   */
  solidHover?: boolean;
  className?: string;
};

const variants: Record<Variant, string> = {
  primary: "border-alva-blue bg-alva-blue text-alva-paper",
  secondary:
    "border-alva-blue bg-transparent text-alva-blue hover:text-alva-paper focus-visible:text-alva-paper",
  inverse:
    "border-alva-paper bg-alva-paper text-alva-blue hover:text-alva-paper focus-visible:text-alva-paper",
  "inverse-accent":
    "border-alva-paper bg-alva-paper text-alva-green hover:text-alva-paper focus-visible:text-alva-paper",
  "outline-inverse":
    "border-alva-paper bg-transparent text-alva-paper"
};

const sizes: Record<Size, string> = {
  default: "min-h-12 gap-8 px-6 py-3 text-ui",
  large: "min-h-14 gap-8 px-7 py-4 text-ui",
  small: "min-h-11 gap-4 px-4 py-2 text-ui-sm"
};

/** Shared button styles, so a real <button> can match ButtonLink exactly. */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "default",
  className?: string,
  solidHover = false
) {
  return cn(
    "group inline-flex items-center justify-between rounded-lg border no-underline transition-colors",
    solidHover
      ? "duration-200 ease-(--ease-brand) hover:border-alva-green hover:bg-alva-green hover:text-alva-paper focus-visible:border-alva-green focus-visible:bg-alva-green focus-visible:text-alva-paper"
      : "fill-down duration-(--duration-fill) ease-(--ease-brand)",
    variants[variant],
    sizes[size],
    className
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "default",
  solidHover = false,
  className
}: Props) {
  return (
    <Link
      className={buttonClasses(variant, size, className, solidHover)}
      href={href}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}
