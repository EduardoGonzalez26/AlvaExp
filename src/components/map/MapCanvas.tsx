"use client";

import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/cn";

export type MapRoute = {
  id: string;
  d: string;
  /** Start and end in SVG units. */
  start: [number, number];
  end: [number, number];
  from: string;
  to: string;
};

type Props = {
  width: number;
  height: number;
  /** Stroke paths that draw the dot matrix (round caps make the dots). */
  dotsNorth: string;
  dotsLatam: string;
  dotSize: number;
  routes: MapRoute[];
  origins: {id: string; x: number; y: number}[];
  tone: "dark" | "light";
  /** Short pointer hint, e.g. "Hover a route". */
  hint: string;
  className?: string;
};

/**
 * Interactive expansion map. Pointer only: the map is decorative and
 * aria-hidden, so nothing here is focusable and screen readers get the
 * section copy instead.
 *
 * Layers, from back to front: a quiet graticule, the dot matrix (with a
 * spotlight that follows the pointer), pulsing destination halos, the routes
 * (drawn on scroll by PageMotion, with a slow flow of dashes once drawn) and
 * the hubs. Hovering a route brings it forward, dims the rest and shows a
 * small label with the two cities.
 */
export function MapCanvas({
  width,
  height,
  dotsNorth,
  dotsLatam,
  dotSize,
  routes,
  origins,
  tone,
  hint,
  className
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState<string | null>(null);
  const [seen, setSeen] = useState(false);
  const hold = useRef(0);

  // Touch devices have no hover: the map tours the routes on its own (and a
  // tap picks one), so the interaction is not desktop-only.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const element = ref.current;

    if (reduce.matches || !coarse.matches || !element) {
      return;
    }

    let index = 0;
    let timer = 0;
    let visible = true;

    // Only tour while the map is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      {threshold: 0.15}
    );
    observer.observe(element);

    const tick = () => {
      // A tap holds the chosen route for a few seconds.
      if (visible && Date.now() > hold.current) {
        setActive(routes[index % routes.length]!.id);
        index += 1;
      }
      timer = window.setTimeout(tick, 3600);
    };

    timer = window.setTimeout(tick, 900);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [routes]);

  const dark = tone === "dark";
  const id = `alva-map-${tone}`;
  const ink = dark ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const accent = dark ? "var(--color-alva-sage)" : "var(--color-alva-green)";
  const viewBox = `0 0 ${width} ${height}`;
  const current = routes.find((route) => route.id === active) ?? null;

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const element = ref.current;
    if (!element) return;

    const {clientX, clientY} = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const box = element.getBoundingClientRect();
      element.style.setProperty("--mx", `${clientX - box.left}px`);
      element.style.setProperty("--my", `${clientY - box.top}px`);
      element.dataset.pointer = "on";
    });
  }

  function leave() {
    cancelAnimationFrame(frame.current);
    delete ref.current?.dataset.pointer;
    setActive(null);
  }

  const at = (route: MapRoute) => ({
    left: `${(route.end[0] / width) * 100}%`,
    top: `${(route.end[1] / height) * 100}%`
  });

  return (
    <div
      aria-hidden="true"
      className={cn("group/map relative select-none", className)}
      data-m="map"
      onPointerLeave={leave}
      onPointerMove={move}
      ref={ref}
    >
      {/* Shared gradients and the hover glow. */}
      <svg className="absolute size-0" focusable="false">
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={`${id}-dots`}
            x1="0"
            x2="0"
            y1="0"
            y2={height}
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
            y1={height * 0.1}
            y2={height * 0.85}
          >
            <stop offset="0" stopColor={ink} />
            <stop offset="1" stopColor={accent} />
          </linearGradient>
        </defs>
      </svg>

      {/* Quiet graticule: gives the ocean depth without noise. */}
      <svg
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full",
          dark ? "opacity-[0.22]" : "opacity-[0.18]"
        )}
        fill="none"
        focusable="false"
        viewBox={viewBox}
      >
        <g stroke={ink} strokeWidth="0.5">
          {Array.from({length: 9}, (_, index) => {
            const y = (height / 9) * (index + 0.5);
            return <path d={`M0 ${y}H${width}`} key={`h${index}`} strokeDasharray="2 10" />;
          })}
          {Array.from({length: 10}, (_, index) => {
            const x = (width / 10) * (index + 0.5);
            return <path d={`M${x} 0V${height}`} key={`v${index}`} strokeDasharray="2 10" />;
          })}
        </g>
      </svg>

      {/* Base dots: the region at rest. */}
      <svg
        className={cn(
          "block h-auto w-full transition-opacity duration-500",
          active ? "opacity-70" : "opacity-100"
        )}
        fill="none"
        focusable="false"
        viewBox={viewBox}
      >
        <path
          d={dotsNorth}
          stroke={`url(#${id}-dots)`}
          strokeLinecap="round"
          strokeOpacity={dark ? 0.42 : 0.35}
          strokeWidth={dotSize}
        />
        <path
          d={dotsLatam}
          stroke={`url(#${id}-dots)`}
          strokeLinecap="round"
          strokeOpacity={dark ? 0.7 : 0.6}
          strokeWidth={dotSize}
        />
      </svg>

      {/* Spotlight: the same dots lit around the pointer. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 [mask-image:radial-gradient(circle_9rem_at_var(--mx,50%)_var(--my,50%),#000_0%,transparent_100%)] group-data-[pointer=on]/map:opacity-100"
        fill="none"
        focusable="false"
        viewBox={viewBox}
      >
        <path
          d={dotsNorth}
          stroke={`url(#${id}-dots)`}
          strokeLinecap="round"
          strokeWidth={dotSize * 1.3}
        />
        <path
          d={dotsLatam}
          stroke={`url(#${id}-dots)`}
          strokeLinecap="round"
          strokeWidth={dotSize * 1.3}
        />
      </svg>

      {/* Routes and hubs. */}
      <svg
        className="absolute inset-0 h-full w-full"
        fill="none"
        focusable="false"
        viewBox={viewBox}
      >
        {routes.map((route, index) => {
          const isActive = active === route.id;
          const dimmed = active !== null && !isActive;

          return (
            <g
              className={cn(
                "transition-opacity duration-300",
                dimmed ? "opacity-25" : "opacity-100"
              )}
              key={route.id}
              onPointerDown={() => {
                setActive(route.id);
                hold.current = Date.now() + 5000;
              }}
              onPointerEnter={() => {
                setActive(route.id);
                setSeen(true);
              }}
              onPointerLeave={() => setActive(null)}
            >
              {/* Wide invisible stroke: a comfortable hover target. */}
              <path d={route.d} stroke="transparent" strokeWidth="30" />

              {/* Continuous flow: falls in once the route has been drawn. */}
              <path
                className="map-flow"
                d={route.d}
                data-m="flow"
                pathLength={1}
                stroke={accent}
                strokeLinecap="round"
                strokeWidth={isActive ? 5 : 4}
                style={{animationDelay: `${index * -0.4}s`}}
              />

              <path
                className={cn(
                  "transition-[stroke-width,opacity] duration-300",
                  isActive ? "opacity-100" : "opacity-80"
                )}
                d={route.d}
                data-m="route"
                pathLength={1}
                stroke={`url(#${id}-route)`}
                strokeLinecap="round"
                strokeWidth={isActive ? 3.5 : 2}
              />

              {/* Destination: halo, dot and pulse. */}
              <circle
                className="map-pulse transition-opacity duration-300"
                cx={route.end[0]}
                cy={route.end[1]}
                data-m="hub-pulse"
                fill="none"
                r="15"
                stroke={accent}
                strokeWidth="1.5"
                style={{animationDelay: `${index * 0.6}s`}}
                vectorEffect="non-scaling-stroke"
              />
              <circle
                className="origin-center transition-transform duration-300 [transform-box:fill-box]"
                cx={route.end[0]}
                cy={route.end[1]}
                data-m="hub"
                fill={accent}
                r="9"
                style={{transform: isActive ? "scale(1.35)" : undefined}}
              />
              <circle
                cx={route.end[0]}
                cy={route.end[1]}
                fill="none"
                r="17"
                stroke={accent}
                strokeOpacity={isActive ? 0.9 : 0.5}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}

        {origins.map((origin) => {
          // The origin of the highlighted route comes forward with it.
          const on = current
            ? Math.abs(current.start[0] - origin.x) < 1 &&
              Math.abs(current.start[1] - origin.y) < 1
            : false;

          return (
            <g key={origin.id}>
              <circle
                className="origin-center transition-transform duration-300 [transform-box:fill-box]"
                cx={origin.x}
                cy={origin.y}
                fill={dark ? "var(--color-alva-blue)" : "var(--color-alva-paper)"}
                r="7"
                stroke={on ? accent : ink}
                strokeWidth={on ? 3 : 2}
                style={{transform: on ? "scale(1.25)" : undefined}}
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={origin.x}
                cy={origin.y}
                fill="none"
                r="12"
                stroke={on ? accent : ink}
                strokeOpacity={on ? 0.7 : 0.35}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      {/* Labels: USA / LATAM and the hovered route. */}
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
          "absolute top-[87%] right-[4%] flex items-center gap-2 font-mono text-eyebrow",
          dark ? "text-alva-paper" : "text-alva-green"
        )}
      >
        <span className="h-px w-6 bg-current" />
        LATAM
      </span>

      {/* Pointer hint, only where hovering exists; it steps aside on first use. */}
      {!seen && !active ? (
        <span
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 hidden font-mono text-[0.65rem] tracking-[0.08em] uppercase opacity-60 [@media(hover:hover)]:block",
            dark ? "text-alva-paper" : "text-alva-blue"
          )}
        >
          {hint}
        </span>
      ) : null}

      {current ? (
        <span
          className={cn(
            "pointer-events-none absolute z-10 -translate-y-1/2 rounded-lg px-2.5 py-1.5 font-mono text-[0.7rem] whitespace-nowrap shadow-none",
            current.end[0] > width * 0.62 ? "-translate-x-[calc(100%+0.75rem)]" : "translate-x-3",
            dark ? "bg-alva-paper text-alva-blue" : "bg-alva-blue text-alva-paper"
          )}
          style={at(current)}
        >
          {current.from} <span aria-hidden="true">→</span> {current.to}
        </span>
      ) : null}
    </div>
  );
}
