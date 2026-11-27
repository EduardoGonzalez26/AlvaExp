"use client";

import { useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { DURATION, EASE_EXPO, gsap, MEDIA, useGSAP } from "@/lib/motion/gsap";

/**
 * Original brand shapes. They never change: the ribbon's outline is always
 * exactly the letterhead artwork, only its colours move.
 */
const SWOOSH_D = "M0 0H1440V6C1180 9 960 20 700 28C440 35 190 34 0 24Z";
const LINE_D = "M0 17C240 32 520 36 820 29C1100 22 1300 12 1440 10";

/**
 * One full colour cycle. With spreadMethod="reflect" the gradient repeats
 * mirrored every 1440 units, so it is seamless every 2 x 1440 units.
 */
const PERIOD = 2880;

/** Seconds for one full cycle: a lively, clearly visible flow. */
const CYCLE = 3;

/** Flow speed in user units per second. */
const SPEED = PERIOD / CYCLE;

/**
 * Signature ribbon from the letterhead: a swoosh that is thick and blue on the
 * left and thins out to green on the right, with a hairline crossing it.
 * Decorative and stretched to the page width. Hidden on the home page (its
 * hero carries the brand mark); it lives in the layout, so on client
 * navigation it simply mounts or unmounts, and each mount runs its own motion.
 */
export function TopRibbon() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return <Ribbon />;
}

/**
 * The ribbon and its motion: drawn from left to right on mount, then the
 * brand gradient flows continuously from left to right along the static
 * shape (the gradient is translated, mirrored by spreadMethod="reflect", so
 * the loop has no seam). The flow stops while the ribbon is off screen or the
 * tab is hidden, and a click or tap on it pauses or resumes it (WCAG 2.2.2).
 * With prefers-reduced-motion: reduce nothing runs and the original gradient
 * stays static.
 */
function Ribbon() {
  const root = useRef<HTMLDivElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const paint = useRef<SVGLinearGradientElement>(null);

  useGSAP(
    () => {
      const wrapper = root.current;
      const svg = art.current;
      const gradient = paint.current;

      if (!wrapper || !svg || !gradient) {
        return;
      }

      const media = gsap.matchMedia();

      try {
        // Either breakpoint with motion allowed: one query, so resizing across
        // 1024 px does not redraw the ribbon.
        media.add(`${MEDIA.desktop}, ${MEDIA.mobile}`, () => {
          const envelope = { value: 0 };
          let clock = 0;
          let started = false;
          let paused = false;
          let inView = true;
          let ticking = false;

          // Own clock, advanced only while running (and scaled by the
          // envelope, so the flow eases in from rest), so resuming never jumps.
          const tick = (_time: number, deltaTime: number) => {
            clock += (Math.min(deltaTime, 50) / 1000) * envelope.value;

            const offset = (clock * SPEED) % PERIOD;

            gradient.setAttribute(
              "gradientTransform",
              `translate(${offset.toFixed(2)} 0)`,
            );
          };

          const sync = () => {
            const run = started && !paused && inView && !document.hidden;

            if (run && !ticking) {
              gsap.ticker.add(tick);
              ticking = true;
            } else if (!run && ticking) {
              gsap.ticker.remove(tick);
              ticking = false;
            }
          };

          const toggle = () => {
            paused = !paused;
            sync();
          };

          const observer =
            typeof IntersectionObserver === "undefined"
              ? null
              : new IntersectionObserver(([entry]) => {
                  inView = entry?.isIntersecting ?? true;
                  sync();
                });

          // Draw-in, then the colour flow eases in from rest.
          gsap
            .timeline({ delay: 0.1 })
            .fromTo(
              svg,
              { scaleX: 0, opacity: 1, transformOrigin: "0% 50%" },
              {
                scaleX: 1,
                duration: DURATION.slow,
                ease: EASE_EXPO,
                clearProps: "opacity,transform,transformOrigin",
              },
            )
            .call(() => {
              started = true;
              sync();
            })
            .to(envelope, { value: 1, duration: 1.6, ease: "sine.inOut" });

          observer?.observe(wrapper);
          document.addEventListener("visibilitychange", sync);
          wrapper.addEventListener("click", toggle);
          wrapper.style.cursor = "pointer";

          return () => {
            gsap.ticker.remove(tick);
            ticking = false;
            observer?.disconnect();
            document.removeEventListener("visibilitychange", sync);
            wrapper.removeEventListener("click", toggle);
            wrapper.style.removeProperty("cursor");
            gradient.removeAttribute("gradientTransform");
          };
        });
      } finally {
        // In every case (reduced motion included) GSAP now owns the ribbon:
        // drop the pre-hydration hide so it can never stay invisible.
        svg.removeAttribute("data-m-pre");
      }

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div
      aria-hidden="true"
      className="relative h-5 w-full sm:h-7 lg:h-9"
      ref={root}
    >
      <svg
        className="absolute inset-0 size-full"
        data-m="ribbon"
        data-m-pre=""
        focusable="false"
        preserveAspectRatio="none"
        ref={art}
        shapeRendering="geometricPrecision"
        viewBox="0 0 1440 36"
      >
        <defs>
          {/* User space across the 1440-wide viewBox: same static look as 0 -> 1. */}
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="alva-ribbon"
            ref={paint}
            spreadMethod="reflect"
            x1="0"
            x2="1440"
            y1="0"
            y2="0"
          >
            <stop offset="0" stopColor="var(--color-alva-blue)" />
            <stop offset=".25" stopColor="var(--color-alva-g1)" />
            <stop offset=".5" stopColor="var(--color-alva-teal)" />
            <stop offset=".78" stopColor="var(--color-alva-g3)" />
            <stop offset="1" stopColor="var(--color-alva-green)" />
          </linearGradient>
        </defs>
        <path d={SWOOSH_D} fill="url(#alva-ribbon)" />
        <path
          d={LINE_D}
          fill="none"
          stroke="url(#alva-ribbon)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
