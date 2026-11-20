import {cn} from "@/lib/cn";

/**
 * Decorative layers behind a section. All of them are aria-hidden, sit under
 * the content (-z-10 inside the section's own stacking context) and never
 * take pointer events.
 */

/** Hairline triangular lattice for dark (blue and gradient) surfaces. */
export function Lattice({className}: {className?: string}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 bg-lattice",
        className
      )}
    />
  );
}

/**
 * Oversized fragments of the "A" mark (a swoosh and a leg), cropped by the
 * edge of the section, as on the deck covers.
 */
export function BrandShapes({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 h-full w-auto max-w-none",
        className
      )}
      data-m="shapes"
      fill="var(--color-alva-paper)"
      fillOpacity="0.1"
      focusable="false"
      preserveAspectRatio="xMaxYMid slice"
      viewBox="0 0 900 800"
    >
      <path d="M70 0C250 210 520 360 900 450V640C520 590 230 440 10 200Z" />
      <path d="M300 800 470 390C535 455 610 505 700 550L520 800Z" />
      <path d="M560 0H700L900 330V120Z" />
    </svg>
  );
}

/**
 * Cover for gradient surfaces: a solid blue layer, invisible by default, that
 * the motion layer shrinks from the bottom up so the gradient is uncovered
 * from top to bottom. Without JavaScript (or with reduced motion) it stays
 * transparent and the gradient is simply there. Render it before Lattice.
 */
export function GradientCover() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-alva-blue opacity-0"
      data-m="gradient"
    />
  );
}

/**
 * Soft sweeping wave for paper sections, after the letterhead. A flat mist
 * tone, so text contrast over it stays above 10:1.
 */
export function BrandWave({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] w-full",
        className
      )}
      fill="var(--color-alva-mist)"
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 1440 600"
    >
      <path d="M0 120C380 190 760 270 1060 400C1230 475 1360 540 1440 600H0Z" />
    </svg>
  );
}
