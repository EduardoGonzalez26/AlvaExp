/**
 * Signature ribbon from the letterhead: a swoosh that is thick and blue on the
 * left and thins out to green on the right, with a hairline crossing it.
 * Decorative and stretched to the page width. On load it is drawn from left
 * to right (see PageMotion).
 */
export function TopRibbon() {
  return (
    <div aria-hidden="true" className="relative h-5 w-full sm:h-7 lg:h-9">
      <svg
        className="absolute inset-0 size-full"
        data-m="ribbon"
        data-m-pre=""
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 1440 36"
      >
        <defs>
          <linearGradient id="alva-ribbon" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--color-alva-blue)" />
            <stop offset=".25" stopColor="var(--color-alva-g1)" />
            <stop offset=".5" stopColor="var(--color-alva-teal)" />
            <stop offset=".78" stopColor="var(--color-alva-g3)" />
            <stop offset="1" stopColor="var(--color-alva-green)" />
          </linearGradient>
        </defs>
        <path
          d="M0 0H1440V6C1180 9 960 20 700 28C440 35 190 34 0 24Z"
          fill="url(#alva-ribbon)"
        />
        <path
          d="M0 17C240 32 520 36 820 29C1100 22 1300 12 1440 10"
          fill="none"
          stroke="url(#alva-ribbon)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
