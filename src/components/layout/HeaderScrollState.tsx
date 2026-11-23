"use client";

import {useEffect} from "react";

/**
 * Flags <html data-scrolled> as soon as the page leaves the very top, so the
 * header can switch from a full-width bar to a floating capsule in CSS. One
 * passive listener, at most one DOM write per frame; renders nothing.
 */
export function HeaderScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.toggleAttribute("data-scrolled", window.scrollY > 4);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return null;
}
