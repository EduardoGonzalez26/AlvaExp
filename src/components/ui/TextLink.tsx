import type {ReactNode} from "react";
import {Link} from "@/i18n/navigation";
import type {RouteHref} from "@/content/types";
import {cn} from "@/lib/cn";
import {ArrowIcon} from "./ArrowIcon";

type Props = {
  href: RouteHref;
  /** The visible label (the part of the brief's "Label → Destination" before the arrow). */
  children: ReactNode;
  /** "dark" is for blue sections. */
  tone?: "light" | "dark";
  className?: string;
};

const tones = {
  light: "text-alva-blue hover:text-alva-green",
  dark: "text-alva-paper hover:text-alva-stone"
} as const;

export function TextLink({href, children, tone = "light", className}: Props) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-11 items-center gap-3.5 text-ui no-underline transition-colors duration-150",
        tones[tone],
        className
      )}
      href={href}
    >
      <span className="underline decoration-1 underline-offset-[0.35em]">
        {children}
      </span>
      <ArrowIcon />
    </Link>
  );
}
