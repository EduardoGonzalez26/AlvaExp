import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";
import {useGSAP} from "@gsap/react";

/**
 * Single entry point for GSAP. Plugins are registered once, in the browser,
 * the first time any client component imports this module. ScrollTrigger and
 * SplitText ship free inside the `gsap` package (3.13+).
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export {gsap, ScrollTrigger, SplitText, useGSAP};

/**
 * Motion tokens. They mirror the CSS (--ease-brand, cubic-bezier(0.22, 1, 0.36, 1)):
 * power4.out is the closest GSAP curve, expo.out the more dramatic cousin.
 */
export const EASE = "power4.out";
export const EASE_EXPO = "expo.out";

export const DURATION = {
  fast: 0.6,
  base: 0.8,
  slow: 1
} as const;

/** Media queries that gate every animation. */
export const MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  /** Lenis and Magnet only run with a mouse-like pointer and no reduce preference. */
  finePointer:
    "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)"
} as const;
