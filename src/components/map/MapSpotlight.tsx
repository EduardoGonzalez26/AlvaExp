"use client";

import {useRef, type ReactNode} from "react";

/**
 * Pointer layer for the expansion map. It only writes two CSS variables
 * (--mx, --my) once per frame; the CSS mask in ExpansionMap turns them into a
 * spotlight over the dots. Touch, keyboard and reduced motion simply see the
 * static map.
 */
export function MapSpotlight({children}: {children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

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
  }

  return (
    <div
      className="group/map relative"
      onPointerLeave={leave}
      onPointerMove={move}
      ref={ref}
    >
      {children}
    </div>
  );
}
