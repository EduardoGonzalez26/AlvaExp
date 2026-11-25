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
 * Oversized mark of the "A" from the logo, ribbon included, anchored to the
 * top right corner and cropped by the edge of the section, as on the deck
 * covers. The silhouettes are copied from public/brand/favicon.svg.
 *
 * One mask cuts the A under the ribbon and around it, leaving a clean gap;
 * the ribbon is then drawn once at the same paper opacity as the A.
 *
 * markId must be unique per page: the mask id is suffixed with it.
 */
export function BrandShapes({
  className,
  markId
}: {
  className?: string;
  markId: string;
}) {
  const cutId = `alva-a-cut-${markId}`;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        // Below md the mark is width-bound so the A stays readable; from md up
        // it is taller than the section, anchored right and cropped by it.
        "pointer-events-none absolute -z-10 h-auto w-[135vw] max-w-none md:h-[135%] md:w-auto",
        className
      )}
      data-m="shapes"
      fill="var(--color-alva-paper)"
      fillOpacity="0.1"
      focusable="false"
      preserveAspectRatio="xMaxYMid slice"
      viewBox="28 44 232 216"
    >
      <defs>
        <mask
          id={cutId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="800"
          height="300"
        >
          <rect width="800" height="300" fill="#fff" fillOpacity={1} />
          <path
            d="M91.4 124C101 140 116 154 146 166.8C165 175 185 178 200 185C216 192 228 203 236 218L251.9 252H210.4L196.6 220C191 213 182 209 172 206C155 201 140 197 127 192C108 184 92 172 78.4 154Z"
            fill="#000"
            fillOpacity={1}
            stroke="#000"
            strokeWidth={16}
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <path
        mask={`url(#${cutId})`}
        d="M122.5 52H165.5L251.9 252H210.4L144 98.1L77.4 252H36.1Z"
      />
      <path d="M91.4 124C101 140 116 154 146 166.8C165 175 185 178 200 185C216 192 228 203 236 218L251.9 252H210.4L196.6 220C191 213 182 209 172 206C155 201 140 197 127 192C108 184 92 172 78.4 154Z" />
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
