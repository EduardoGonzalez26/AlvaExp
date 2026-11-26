type Props = {
  business: string;
  alva: string;
  shared: string;
};

const LABEL = "max-w-[11rem] text-ui uppercase tracking-[0.12em] text-alva-stone";

/**
 * About hero signature: two overlapping circles, your business and Alva in
 * the market, with the shared space between them carrying the gradient. The
 * labels sit beside the circles (below them on phones) and the shared word
 * under the overlap. Centred in the band on desktop, between the title and
 * the lead. The markup is the final state; heroSignature() plays it on load.
 *
 * Circle strokes use pathLength="1" so the animation can draw them with a
 * dash offset; each one starts on its outer side (rotated 180° on the left).
 */
export function TogetherDiagram({business, alva, shared}: Props) {
  return (
    <figure
      className="mx-auto grid w-fit grid-cols-2 items-center gap-x-6 gap-y-3 sm:grid-cols-[auto_auto_auto] sm:gap-x-8"
      data-m="venn"
    >
      <span className={`${LABEL} order-3 sm:order-none sm:justify-self-end sm:text-right`} data-m="venn-label">
        {business}
      </span>
      <svg
        aria-hidden="true"
        className="order-1 col-span-2 h-[clamp(7.5rem,22svh,16rem)] w-auto justify-self-center overflow-visible sm:order-none sm:col-span-1 [@media(max-height:660px)]:h-[18svh]"
        focusable="false"
        viewBox="0 0 200 100"
      >
        <defs>
          <linearGradient id="together-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--color-alva-g1)" />
            <stop offset="1" stopColor="var(--color-alva-green)" />
          </linearGradient>
          <clipPath id="together-clip">
            <circle cx="70" cy="50" r="48" />
          </clipPath>
        </defs>
        <g data-m="venn-x">
          <circle clipPath="url(#together-clip)" cx="130" cy="50" fill="url(#together-grad)" r="48" />
        </g>
        <g data-m="venn-a">
          <circle
            cx="70"
            cy="50"
            data-m="venn-stroke"
            fill="none"
            pathLength={1}
            r="48"
            stroke="var(--color-alva-paper)"
            strokeWidth="0.8"
            transform="rotate(180 70 50)"
          />
        </g>
        <g data-m="venn-b">
          <circle
            cx="130"
            cy="50"
            data-m="venn-stroke"
            fill="none"
            pathLength={1}
            r="48"
            stroke="var(--color-alva-paper)"
            strokeWidth="0.8"
          />
        </g>
      </svg>
      <span className={`${LABEL} order-4 justify-self-end text-right sm:order-none sm:justify-self-start sm:text-left`} data-m="venn-label">
        {alva}
      </span>
      {/* Centred under the overlap (middle column from sm up). */}
      <figcaption
        className="order-2 col-span-2 overflow-hidden text-center sm:order-none sm:col-span-1 sm:col-start-2"
      >
        <span className="block pb-[0.1em] font-serif text-card-title italic" data-m="venn-caption">
          {shared}
        </span>
      </figcaption>
    </figure>
  );
}
