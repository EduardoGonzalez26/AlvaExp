"use client";

import {useEffect} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {gsap, MEDIA, ScrollTrigger} from "@/lib/motion/gsap";

/** Hash links the browser would handle natively, resolved to their target. */
function anchorTarget(event: MouseEvent): {hash: string; target: HTMLElement} | null {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  ) {
    return null;
  }

  const link = event.target.closest<HTMLAnchorElement>("a[href]");

  if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) {
    return null;
  }

  const url = new URL(link.href, window.location.href);
  const here = window.location;

  if (
    url.origin !== here.origin ||
    url.pathname !== here.pathname ||
    url.search !== here.search ||
    url.hash.length < 2
  ) {
    return null;
  }

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));

  return target ? {hash: url.hash, target} : null;
}

/**
 * Lenis smooth scroll, one instance for the whole site, driven by the GSAP
 * ticker so ScrollTrigger and the scroll stay in the same frame.
 *
 * It only starts with a fine pointer and no reduced-motion preference. On
 * touch devices and with reduce, native scrolling is untouched: no instance,
 * no listeners, no classes on <html>. The media query is observed, so the
 * instance is created or destroyed if the preference changes.
 *
 * In-page links (the skip link, #validate, #build, #scale) are scrolled by
 * Lenis, honouring scroll-margin-top, and then focus is moved to the target
 * as the browser would do. Links handled by the Next router keep their own
 * behaviour.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(MEDIA.finePointer);
    let lenis: Lenis | null = null;
    let cleanup: (() => void) | null = null;

    function start() {
      if (lenis) {
        return;
      }

      const instance = new Lenis({
        autoRaf: false,
        // Snappier than Lenis' default (0.1): the page follows the wheel
        // closely and settles fast, with just a touch of smoothing.
        lerp: 0.18,
        wheelMultiplier: 1.15,
        smoothWheel: true,
        syncTouch: false,
        // Textareas and selects that scroll on their own keep native wheel.
        allowNestedScroll: true,
        // A click that navigates to another page drops any wheel inertia.
        stopInertiaOnNavigate: true
      });
      lenis = instance;

      const onScroll = () => ScrollTrigger.update();
      const onTick = (time: number) => instance.raf(time * 1000);

      instance.on("scroll", onScroll);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      const onClick = (event: MouseEvent) => {
        const anchor = anchorTarget(event);

        if (!anchor) {
          return;
        }

        event.preventDefault();
        const {hash, target} = anchor;

        instance.scrollTo(target, {
          duration: 0.8,
          onComplete: () => {
            window.history.pushState(window.history.state, "", hash);
          }
        });

        // Match native behaviour: the target becomes the focus start point.
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
          target.addEventListener(
            "blur",
            () => target.removeAttribute("tabindex"),
            {once: true}
          );
        }
        target.focus({preventScroll: true});
      };

      document.addEventListener("click", onClick);
      // A modal dialog scrolls on its own: stop Lenis while it is open.
      const onDialog = (event: Event) => {
        const open = (event as CustomEvent<{open: boolean}>).detail?.open;
        if (open) instance.stop();
        else instance.start();
      };
      window.addEventListener("alva:dialog", onDialog);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("alva:dialog", onDialog);
        instance.off("scroll", onScroll);
        gsap.ticker.remove(onTick);
        gsap.ticker.lagSmoothing(500, 33);
        instance.destroy();
      };
    }

    function stop() {
      cleanup?.();
      cleanup = null;
      lenis = null;
    }

    function sync() {
      if (query.matches) {
        start();
      } else {
        stop();
      }
    }

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
