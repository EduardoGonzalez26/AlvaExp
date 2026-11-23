"use client";

import {useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import {BrandLogo} from "@/components/layout/BrandLogo";

type State = "initial" | "enter" | "out" | "idle";

/** Shortest time the logo stays on screen, so the screen never just flickers. */
const MIN_VISIBLE = 650;
/** Exit wipe length (keep in sync with .route-loader in globals.css). */
const EXIT = 560;
/** If a navigation never lands (error, cancelled), give the page back. */
const GIVE_UP = 8000;

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/**
 * Brand loader between screens: a paper panel with the Alva logo in the
 * middle and a blue to green line that keeps moving. It covers the page from
 * top to bottom when an internal link is followed and uncovers the new page
 * from top to bottom once it has rendered. It also opens the first visit.
 *
 * Skipped for the language switch (it has its own transition), same-page
 * anchors, new tabs and downloads, and entirely with reduced motion. It is
 * decorative (aria-hidden): navigation and focus work as usual underneath.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("initial");
  const startedAt = useRef(0);
  const lastPath = useRef(pathname);
  const timers = useRef<number[]>([]);

  function later(callback: () => void, delay: number) {
    timers.current.push(window.setTimeout(callback, delay));
  }

  function hide(after: number) {
    later(() => {
      setState("out");
      later(() => setState("idle"), EXIT);
    }, Math.max(0, after));
  }

  // First visit: wait for the fonts, then uncover the page.
  useEffect(() => {
    const started = performance.now();
    let cancelled = false;

    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) hide(450 - (performance.now() - started));
    });

    const pending = timers.current;
    return () => {
      cancelled = true;
      pending.forEach(window.clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Internal link followed: cover the page.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Next's <Link> calls preventDefault for client navigation, so
      // defaultPrevented is not a reason to skip.
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (
        !anchor ||
        !anchor.href ||
        anchor.hasAttribute("download") ||
        anchor.hasAttribute("hreflang") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        normalize(url.pathname) === normalize(window.location.pathname)
      ) {
        return;
      }

      startedAt.current = performance.now();
      setState("enter");
      later(() => setState((current) => (current === "enter" ? "out" : current)), GIVE_UP);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // The new page has rendered: uncover it once the logo has had its moment.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    if (startedAt.current) {
      const elapsed = performance.now() - startedAt.current;
      startedAt.current = 0;
      hide(MIN_VISIBLE - elapsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div aria-hidden="true" className="route-loader" data-state={state}>
      <div className="route-loader-mark">
        <BrandLogo priority size="xl" variant="light" />
        <span className="route-loader-bar" />
      </div>
    </div>
  );
}
