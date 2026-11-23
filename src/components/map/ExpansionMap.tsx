import {cn} from "@/lib/cn";
import {
  DOT_SIZE,
  MAP_DOTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ORIGINS,
  project,
  ROUTES
} from "@/lib/map/americas";
import {MapSpotlight} from "./MapSpotlight";

type Props = {
  /** "dark" for blue and gradient sections, "light" for paper and stone. */
  tone?: "dark" | "light";
  className?: string;
};

const VIEWBOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;

/**
 * Expansion map: the Americas as a dot matrix, from the United States (top)
 * to Latin America (below), with arcs that carry a business south. It reads
 * the brand transition top to bottom. Decorative (aria-hidden): the section
 * copy says everything; the map only illustrates it.
 *
 * Interaction: a spotlight follows the mouse over the dots, and hovering a
 * route or destination brings it forward while the others recede. On scroll
 * the arcs are drawn from north to south (see PageMotion › expansionMap).
 */
export function ExpansionMap({tone = "dark", className}: Props) {
  const dark = tone === "dark";
  const id = `alva-map-${tone}`;
  const ink = dark ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const accent = dark ? "var(--color-alva-sage)" : "var(--color-alva-green)";

  const dots = (opacityNorth: number, opacityLatam: number, size = DOT_SIZE) => (
    <>
      <path
        d={MAP_DOTS.north}
        stroke={`url(#${id}-dots)`}
        strokeLinecap="round"
        strokeOpacity={opacityNorth}
        strokeWidth={size}
      />
      <path
        d={MAP_DOTS.latam}
        stroke={`url(#${id}-dots)`}
        strokeLinecap="round"
        strokeOpacity={opacityLatam}
        strokeWidth={size}
      />
    </>
  );

  return (
    <div
      aria-hidden="true"
      className={cn("relative select-none", className)}
      data-m="map"
    >
      <MapSpotlight>
        {/* Shared gradients: blue (or paper) north, green (or sage) south. */}
        <svg className="absolute size-0" focusable="false">
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={`${id}-dots`}
              x1="0"
              x2="0"
              y1="0"
              y2={MAP_HEIGHT}
            >
              <stop offset="0" stopColor={ink} />
              <stop offset="0.3" stopColor={dark ? "var(--color-alva-stone)" : "var(--color-alva-teal)"} />
              <stop offset="1" stopColor={accent} />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={`${id}-route`}
              x1="0"
              x2="0"
              y1={MAP_HEIGHT * 0.1}
              y2={MAP_HEIGHT * 0.85}
            >
              <stop offset="0" stopColor={ink} />
              <stop offset="1" stopColor={accent} />
            </linearGradient>
          </defs>
        </svg>

        {/* Base layer: the region in quiet dots. */}
        <svg className="block h-auto w-full" fill="none" focusable="false" viewBox={VIEWBOX}>
          {dots(dark ? 0.42 : 0.35, dark ? 0.7 : 0.6)}
        </svg>

        {/* Spotlight layer: the same dots, fully lit, masked around the mouse. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 [mask-image:radial-gradient(circle_9rem_at_var(--mx,50%)_var(--my,50%),#000_0%,transparent_100%)] group-data-[pointer=on]/map:opacity-100"
          fill="none"
          focusable="false"
          viewBox={VIEWBOX}
        >
          {dots(1, 1, DOT_SIZE * 1.25)}
        </svg>

        {/* Routes and hubs on top. Hovering one dims the rest. */}
        <svg
          className="absolute inset-0 h-full w-full"
          fill="none"
          focusable="false"
          viewBox={VIEWBOX}
        >
          <g className="[&:has(.route:hover)_.route:not(:hover)]:opacity-25">
            {ROUTES.map((route) => (
              <g
                className="route cursor-default transition-opacity duration-300"
                key={route.id}
              >
                {/* Wide transparent stroke: a comfortable hover target. */}
                <path d={route.d} stroke="transparent" strokeWidth="28" />
                <path
                  className="transition-[stroke-width] duration-300 [.route:hover_&]:[stroke-width:4]"
                  d={route.d}
                  data-m="route"
                  pathLength={1}
                  stroke={`url(#${id}-route)`}
                  strokeLinecap="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  className="origin-center transition-transform duration-300 [transform-box:fill-box] [.route:hover_&]:scale-150"
                  cx={route.end[0]}
                  cy={route.end[1]}
                  data-m="hub"
                  fill={accent}
                  r="9"
                />
                <circle
                  cx={route.end[0]}
                  cy={route.end[1]}
                  data-m="hub"
                  fill="none"
                  r="17"
                  stroke={accent}
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </g>

          {ORIGINS.map((origin) => {
            const [cx, cy] = project(origin.at);
            return (
              <circle
                cx={cx}
                cy={cy}
                fill={dark ? "var(--color-alva-blue)" : "var(--color-alva-paper)"}
                key={origin.id}
                r="7"
                stroke={ink}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* Mono legend: where the transition starts and where it lands. */}
        <span
          className={cn(
            "absolute top-[12%] right-[6%] font-mono text-eyebrow",
            dark ? "text-alva-paper" : "text-alva-blue"
          )}
        >
          USA
        </span>
        <span
          className={cn(
            "absolute top-[80%] right-[6%] flex items-center gap-2 font-mono text-eyebrow",
            dark ? "text-alva-paper" : "text-alva-green"
          )}
        >
          <span className="h-px w-6 bg-current" />
          LATAM
        </span>
      </MapSpotlight>
    </div>
  );
}
