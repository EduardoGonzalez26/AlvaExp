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
 * Motion tokens: one restrained curve for content (close to the CSS
 * --ease-brand) and one for hairlines being drawn. Short distances and
 * durations keep the motion quiet and corporate.
 */
export const EASE = "power3.out";
export const EASE_EXPO = "power2.inOut";

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9
} as const;

/** Vertical travel of content entering the page, in px. */
export const RISE = 16;

/** Media queries that gate every animation. */
export const MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  /** Lenis only runs with a mouse-like pointer and no reduce preference. */
  finePointer:
    "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)"
} as const;
