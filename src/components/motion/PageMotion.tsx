"use client";

import {usePathname} from "next/navigation";
import {
  approach,
  boxScroll,
  surfaces,
  diagrams,
  expansionMap,
  footer,
  gradients,
  headings,
  hero,
  heroSignature,
  indexRules,
  networkPulse,
  phases,
  releaseAll,
  reveals,
  staggers,
  stats
} from "@/lib/motion/animations";
import {gsap, MEDIA, ScrollTrigger, useGSAP} from "@/lib/motion/gsap";

type Setup = (context: {desktop: boolean}) => void | (() => void);

/**
 * Runs `setup` only when motion is allowed, with the breakpoint it matched.
 * With prefers-reduced-motion: reduce nothing is created, so every element
 * stays in its final state (the reduce branch has no GSAP work on purpose).
 */
function whenMotionAllowed(setup: Setup) {
  const media = gsap.matchMedia();

  media.add(
    {desktop: MEDIA.desktop, mobile: MEDIA.mobile, reduce: MEDIA.reduce},
    (context) => {
      const {desktop, mobile} = context.conditions as {
        desktop?: boolean;
        mobile?: boolean;
        reduce?: boolean;
      };

      if (!desktop && !mobile) {
        return undefined;
      }

      return setup({desktop: Boolean(desktop)});
    }
  );

  return media;
}

/**
 * Motion for the whole site, as one small client island that renders nothing.
 * Server Components only place data attributes (data-m, data-m-i, data-m-pre);
 * the animations live in @/lib/motion/animations.
 *
 * Two scopes:
 *  - the layout (footer): once per layout mount;
 *  - the page: rebuilt on every route change, reverting the previous page.
 *
 * The initial states are set inside useGSAP (a layout effect), before the
 * browser paints the hydrated tree. Elements that are visible on first paint
 * are held back by `[data-m-pre]` (see globals.css), which has
 * a short CSS fail-safe, and released here once GSAP owns them.
 *
 * The header ribbon is not here: it is hidden on the home page and may mount
 * after the layout, so TopRibbon runs its own draw-in and undulation.
 */
export function PageMotion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const media = whenMotionAllowed(() => {
        gradients("footer");
        footer();
      });

      return () => media.revert();
    },
    {dependencies: []}
  );

  useGSAP(
    () => {
      let media: gsap.MatchMedia | null = null;

      try {
        media = whenMotionAllowed(({desktop}) => {
          hero();
          heroSignature();
          headings();
          indexRules();
          reveals();
          approach(desktop);
          staggers();
          gradients("main");
          stats();
          expansionMap();
          diagrams();
          const cleanPulse = networkPulse();
          surfaces(desktop);
          phases();
          // Last: its trigger must refresh after every other one.
          const cleanBox = desktop ? boxScroll() : undefined;

          // Opening or closing a FAQ item changes the page height.
          let timer = 0;
          const onToggle = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => ScrollTrigger.refresh(), 60);
          };

          document.addEventListener("toggle", onToggle, true);
          // Trigger positions depend on the new page and on web fonts.
          ScrollTrigger.refresh();
          void document.fonts?.ready.then(() => ScrollTrigger.refresh());

          return () => {
            window.clearTimeout(timer);
            document.removeEventListener("toggle", onToggle, true);
            cleanBox?.();
            cleanPulse?.();
          };
        });
      } finally {
        // Whatever happened, no element may stay hidden by the pre-hydration rule.
        releaseAll();
      }

      return () => media?.revert();
    },
    {dependencies: [pathname], revertOnUpdate: true}
  );

  return null;
}
