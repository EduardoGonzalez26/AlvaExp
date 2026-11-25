import type {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/cn";
import {BrandShapes, BrandWave, GradientCover, Lattice} from "./Backdrop";

export type SectionTone = "paper" | "stone" | "blue" | "gradient";

type Props = ComponentPropsWithoutRef<"section"> & {
  /**
   * Surface. paper and stone are light; blue is the solid brand blue;
   * gradient is the brand transition from blue (top) to green (bottom).
   * Only palette combinations validated for contrast are offered.
   */
  tone?: SectionTone;
  /** Hairline on top, to separate consecutive paper sections. */
  bordered?: boolean;
  /** Standard vertical rhythm. Disable for sections that set their own. */
  padded?: boolean;
  /** Decorative numeric index above the content ("01", "02"...). */
  index?: boolean;
  /** Oversized A mark from the logo (ribbon included) on a dark surface. */
  shapes?: boolean;
  /** Unique suffix for the shape mask ids. One shape per page section. */
  shapesId?: string;
  /** Soft letterhead wave on a paper surface. */
  wave?: boolean;
};

const tones: Record<SectionTone, string> = {
  paper: "bg-alva-paper text-alva-blue",
  stone: "bg-alva-stone text-alva-blue",
  blue: "bg-alva-blue text-alva-paper",
  gradient: "bg-brand-gradient text-alva-paper"
};

const indexTones: Record<SectionTone, string> = {
  paper: "text-alva-green",
  stone: "text-alva-blue",
  blue: "text-alva-stone",
  gradient: "text-alva-paper"
};

export function Section({
  tone = "paper",
  bordered = false,
  padded = true,
  index = true,
  shapes = false,
  shapesId = "section",
  wave = false,
  className,
  children,
  ...props
}: Props) {
  const dark = tone === "blue" || tone === "gradient";

  return (
    <section
      // Dark surfaces switch the focus ring to paper (see globals.css).
      data-surface={dark ? "dark" : undefined}
      // Coloured surfaces open up as they scroll in (see PageMotion › surfaces).
      data-m={tone === "paper" ? undefined : "surface"}
      className={cn(
        "relative isolate overflow-x-clip",
        tones[tone],
        padded && "py-section",
        bordered && "border-t border-alva-stone",
        className
      )}
      {...props}
    >
      {tone === "gradient" ? <GradientCover /> : null}
      {dark ? <Lattice /> : null}
      {dark && shapes ? (
        <BrandShapes className="top-0 right-0" markId={shapesId} />
      ) : null}
      {!dark && wave ? <BrandWave /> : null}

      {index && padded ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--spacing-section)*0.42)]"
        >
          <div className="mx-auto w-full max-w-page px-gutter">
            <span
              className={cn(
                "section-index flex items-center gap-4 font-serif text-lg",
                indexTones[tone]
              )}
            >
              <span
                className={cn(
                  "h-px w-12",
                  dark ? "bg-current" : "bg-brand-gradient-x"
                )}
                data-m="index-rule"
              />
            </span>
          </div>
        </div>
      ) : null}

      {children}
    </section>
  );
}
