import type {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/cn";

export type SectionTone = "paper" | "stone" | "blue";

type Props = ComponentPropsWithoutRef<"section"> & {
  /** Surface color. Only palette combinations validated for contrast are offered. */
  tone?: SectionTone;
  /** Hairline on top, to separate consecutive paper sections. */
  bordered?: boolean;
  /** Standard vertical rhythm. Disable for sections that set their own. */
  padded?: boolean;
};

const tones: Record<SectionTone, string> = {
  paper: "bg-alva-paper text-alva-blue",
  stone: "bg-alva-stone text-alva-blue",
  blue: "bg-alva-blue text-alva-paper"
};

export function Section({
  tone = "paper",
  bordered = false,
  padded = true,
  className,
  ...props
}: Props) {
  return (
    <section
      // Dark surfaces switch the focus ring to paper (see globals.css).
      data-surface={tone === "blue" ? "dark" : undefined}
      className={cn(
        tones[tone],
        padded && "py-section",
        bordered && "border-t border-alva-stone",
        className
      )}
      {...props}
    />
  );
}
