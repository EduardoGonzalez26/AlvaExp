"use client";

import {useEffect} from "react";

/** Scroll distance over which the bar becomes a capsule, in px. */
const RANGE = 120;

/**
 * Drives the header morph with the scroll: writes --hp on <html> (0 at the
 * very top, 1 after RANGE px, eased so it starts and settles softly) and
 * flags data-scrolled once the capsule dominates. One passive listener, at
 * most one style write per frame; renders nothing.
 */
export function HeaderScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let last = -1;

    const update = () => {
      frame = 0;
      const t = Math.min(1, Math.max(0, window.scrollY / RANGE));
      // Smoothstep: gentle at both ends.
      const p = Math.round(t * t * (3 - 2 * t) * 1000) / 1000;

      if (p !== last) {
        last = p;
        root.style.setProperty("--hp", String(p));
        root.toggleAttribute("data-scrolled", p >= 0.5);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", onScroll, {passive: true});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--hp");
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return null;
}
