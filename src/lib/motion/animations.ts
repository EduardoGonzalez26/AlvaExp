import {
  DURATION,
  EASE,
  EASE_EXPO,
  gsap,
  RISE,
  ScrollTrigger,
  SplitText
} from "./gsap";

/**
 * Section animations. Every function reads the DOM through data attributes
 * placed by the Server Components and writes only `transform` and `opacity`.
 * They are called inside gsap.matchMedia() (see PageMotion), so everything
 * they create is reverted when the page changes or the preference flips.
 *
 * Direction rule: the brand moves from blue (top) to green (bottom), so
 * sequences run from the top of the page downwards, lines are drawn from the
 * top or the left, and gradients are uncovered from the top.
 */

const CLEAR = "opacity,transform";

function all<T extends HTMLElement = HTMLElement>(
  selector: string,
  root: ParentNode = document
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** Marks an element as taken over by GSAP (drops the pre-hydration hide). */
function release(element: Element) {
  element.removeAttribute("data-m-pre");
}

/** Safety net: nothing may stay hidden by the pre-hydration rule. */
export function releaseAll() {
  all("[data-m-pre]").forEach(release);
}

/**
 * Splits a heading into masked lines that rise into place. The text, the
 * trailing <em> and any link or language span are kept by SplitText (it
 * clones nested wrappers per line) and the original markup is restored when
 * the animation ends. SplitText adds an aria-label with the full text.
 */
function riseByLines(
  element: HTMLElement,
  options: {delay?: number; onScroll?: boolean} = {}
) {
  const {delay = 0, onScroll = false} = options;

  const split = SplitText.create(element, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    aria: "auto",
    linesClass: "m-line",
    onSplit(self) {
      // Let italics and descenders overflow the mask while the lines move.
      self.masks.forEach((mask) =>
        (mask as HTMLElement).style.setProperty("overflow-clip-margin", "0.25em")
      );

      return gsap.from(self.lines, {
        yPercent: 100,
        duration: DURATION.slow,
        ease: EASE,
        stagger: 0.08,
        delay,
        scrollTrigger: onScroll
          ? {trigger: element, start: "top 88%", once: true}
          : undefined,
        onComplete: () => split.revert()
      });
    }
  });
}

/** Ribbon of the letterhead: drawn from left to right once per visit. */
export function ribbon() {
  const element = all('[data-m="ribbon"]')[0];

  if (!element) {
    return;
  }

  gsap.fromTo(
    element,
    {scaleX: 0, opacity: 1, transformOrigin: "0% 50%"},
    {
      scaleX: 1,
      duration: DURATION.slow,
      ease: EASE_EXPO,
      delay: 0.1,
      clearProps: "opacity,transform,transformOrigin"
    }
  );
  release(element);
}

/** Hero and PageHero: strip and rules drawn, content in sequence. */
export function hero() {
  const section = all('[data-m="hero"]')[0];

  if (!section) {
    return;
  }

  all('[data-m="strip"]', section).forEach((strip) => {
    gsap.fromTo(
      strip,
      {scaleX: 0, opacity: 1, transformOrigin: "0% 50%"},
      {
        scaleX: 1,
        duration: DURATION.slow,
        ease: EASE_EXPO,
        delay: 0.4,
        clearProps: "opacity,transform,transformOrigin"
      }
    );
    release(strip);
  });

  all('[data-m="rule"]', section).forEach((rule, index) => {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "0% 50%",
      duration: DURATION.slow,
      ease: EASE_EXPO,
      delay: 0.2 + index * 0.15,
      clearProps: "transform,transformOrigin"
    });
  });

  all("[data-m-i]", section).forEach((item, index) => {
    const delay = 0.05 + index * 0.08;

    if (item.dataset.mI === "title") {
      riseByLines(item, {delay});
    } else {
      gsap.fromTo(
        item,
        {opacity: 0, y: RISE},
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE,
          delay,
          clearProps: CLEAR
        }
      );
    }

    release(item);
  });
}

/**
 * Section titles (and the h1 of pages without a hero): masked lines rise when
 * the title enters. Titles with their own data-m, or with language spans or
 * nested blocks, are left to the generic reveal.
 */
export function headings() {
  all("main h1, main h2").forEach((heading) => {
    if (
      heading.closest('[data-m="hero"]') ||
      heading.hasAttribute("data-m") ||
      heading.querySelector("[lang]")
    ) {
      return;
    }

    riseByLines(heading, {onScroll: true});
    release(heading);
  });
}

/** Blocks that rise in once, in the order they enter (top to bottom). */
export function reveals() {
  const elements = all('main [data-m="reveal"]');

  if (!elements.length) {
    return;
  }

  gsap.set(elements, {opacity: 0, y: RISE});
  ScrollTrigger.batch(elements, {
    start: "top 90%",
    once: true,
    interval: 0.1,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: DURATION.base,
        ease: EASE,
        stagger: 0.08,
        clearProps: CLEAR
      })
  });
  elements.forEach(release);
}

/**
 * Card grids and lists: children enter row by row, top to bottom. A card's
 * top hairline (data-m="card-rule") is drawn from the left once it is in.
 */
export function staggers() {
  all('main [data-m="stagger"]').forEach((group) => {
    const items = Array.from(group.children) as HTMLElement[];

    if (!items.length) {
      return;
    }

    const rules = all('[data-m="card-rule"]', group);

    gsap.set(items, {opacity: 0, y: RISE});
    gsap.set(rules, {scaleX: 0, transformOrigin: "0% 50%"});
    ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      interval: 0.1,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE,
          stagger: 0.08,
          clearProps: CLEAR
        });
        gsap.to(
          batch.flatMap((item) => all('[data-m="card-rule"]', item as HTMLElement)),
          {
            scaleX: 1,
            duration: DURATION.slow,
            ease: EASE_EXPO,
            stagger: 0.08,
            delay: 0.15,
            clearProps: "transform,transformOrigin"
          }
        );
      }
    });
  });
}

/** Section index: the hairline next to the number is drawn from the left. */
export function indexRules() {
  all('main [data-m="index-rule"]').forEach((rule) => {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "0% 50%",
      duration: DURATION.slow,
      ease: EASE_EXPO,
      clearProps: "transform,transformOrigin",
      scrollTrigger: {trigger: rule, start: "top 92%", once: true}
    });
  });
}

/**
 * Gradient surfaces: the blue cover shrinks towards the bottom edge, so the
 * gradient is uncovered from top to bottom. `scope` picks the page content or
 * the footer.
 */
export function gradients(scope: "main" | "footer") {
  all(`${scope} [data-m="gradient"]`).forEach((cover) => {
    const host = cover.parentElement;

    if (!host) {
      return;
    }

    gsap.set(cover, {opacity: 1, scaleY: 1, transformOrigin: "50% 100%"});
    gsap.to(cover, {
      scaleY: 0,
      duration: DURATION.slow,
      ease: EASE_EXPO,
      clearProps: "opacity,transform,transformOrigin",
      scrollTrigger: {trigger: host, start: "clamp(top 80%)", once: true}
    });
  });
}

/**
 * Key figures: the hairline above each one is drawn left to right, then the
 * figure fades up. The text is literal; nothing is counted.
 */
export function stats() {
  all('main [data-m="stats"]').forEach((group) => {
    const rules = all('[data-m="stat-rule"]', group);
    const texts = all('[data-m="stat-text"]', group);

    gsap.set(rules, {scaleX: 0, transformOrigin: "0% 50%"});
    gsap.set(texts, {opacity: 0, y: RISE});

    gsap
      .timeline({
        scrollTrigger: {trigger: group, start: "top 85%", once: true}
      })
      .to(
        rules,
        {scaleX: 1, duration: DURATION.slow, ease: EASE_EXPO, stagger: 0.15},
        0
      )
      .to(
        texts,
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE,
          stagger: 0.15,
          clearProps: CLEAR
        },
        0.25
      );
  });
}

/**
 * Home approach: the blue to green line is drawn as you scroll (left to right
 * on desktop, top to bottom on small screens) and each stage dot switches on
 * when the line reaches it.
 */
export function approach(desktop: boolean) {
  all('main [data-m="approach"]').forEach((root) => {
    const line = root.querySelector<HTMLElement>('[data-m="approach-line"]');

    if (!line) {
      return;
    }

    const dots = all('[data-m="approach-dot"]', root);
    const box = root.getBoundingClientRect();

    gsap.set(
      line,
      desktop
        ? {scaleX: 0, transformOrigin: "0% 50%"}
        : {scaleY: 0, transformOrigin: "50% 0%"}
    );
    gsap.set(dots, {scale: 0});

    const timeline = gsap.timeline({
      defaults: {ease: "none"},
      scrollTrigger: {
        trigger: root,
        start: desktop ? "clamp(top 80%)" : "clamp(top 70%)",
        end: desktop ? "clamp(top 35%)" : "clamp(bottom 60%)",
        scrub: true
      }
    });

    timeline.to(line, desktop ? {scaleX: 1, duration: 1} : {scaleY: 1, duration: 1}, 0);

    dots.forEach((dot) => {
      const rect = dot.getBoundingClientRect();
      const fraction = desktop
        ? (rect.left - box.left) / box.width
        : (rect.top + rect.height / 2 - box.top) / box.height;

      timeline.to(
        dot,
        {scale: 1, duration: 0.08, ease: EASE},
        Math.min(0.92, Math.max(0, fraction))
      );
    });
  });
}

/**
 * How We Work phases: the rail is drawn from top to bottom with the scroll
 * (blue to green), every step enters as the rail reaches its dot, and the
 * step being read is marked with data-active (styled in Phases).
 */
export function phases() {
  all('main [data-m="rail-group"]').forEach((group) => {
    const rail = group.querySelector<HTMLElement>('[data-m="rail"]');

    if (rail) {
      gsap.set(rail, {scaleY: 0, transformOrigin: "50% 0%"});
      gsap.to(rail, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: group,
          start: "clamp(top 70%)",
          end: "clamp(bottom 70%)",
          scrub: true
        }
      });
    }

    all('[data-m="step"]', group).forEach((step) => {
      const dot = step.querySelector<HTMLElement>('[data-m="step-dot"]');
      const body = all(":scope > h3, :scope > div", step);

      gsap.set(body, {opacity: 0, y: RISE});

      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        end: "bottom 60%",
        onToggle: (self) => {
          if (self.isActive) {
            step.setAttribute("data-active", "");
          } else {
            step.removeAttribute("data-active");
          }
        }
      });

      if (dot) {
        gsap.set(dot, {scale: 0});
      }

      const timeline = gsap.timeline({
        scrollTrigger: {trigger: step, start: "top 70%", once: true}
      });

      if (dot) {
        timeline.to(dot, {scale: 1, duration: DURATION.fast, ease: EASE}, 0);
      }

      timeline.to(
        body,
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE,
          stagger: 0.08,
          clearProps: CLEAR
        },
        0.1
      );
    });
  });
}

/**
 * Expansion map: the arcs are drawn from the United States southwards as the
 * map scrolls through the viewport, one after another (north to south), and
 * each destination appears when its arc arrives.
 */
export function expansionMap() {
  all('main [data-m="map"]').forEach((map) => {
    const routes = all<HTMLElement>('[data-m="route"]', map);
    const hubs = all<HTMLElement>('[data-m="hub"]', map);
    const flows = all<HTMLElement>('[data-m="flow"]', map);
    const pulses = all<HTMLElement>('[data-m="hub-pulse"]', map);

    gsap.set(routes, {strokeDasharray: 1, strokeDashoffset: 1});
    gsap.set(hubs, {scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box"});
    gsap.set(flows, {opacity: 0});
    gsap.set(pulses, {opacity: 0});

    const timeline = gsap.timeline({
      defaults: {ease: "none"},
      scrollTrigger: {
        trigger: map,
        start: "clamp(top 85%)",
        end: "clamp(center 45%)",
        scrub: 0.6
      }
    });

    routes.forEach((route, index) => {
      const at = index * 0.35;
      timeline.to(route, {strokeDashoffset: 0, duration: 1}, at);
      timeline.to(
        hubs.slice(index * 2, index * 2 + 2),
        {scale: 1, duration: 0.25, ease: EASE},
        at + 0.85
      );
      timeline.to(
        pulses.slice(index, index + 1),
        {opacity: 1, duration: 0.3, ease: EASE},
        at + 1
      );
    });

    // Once the arcs are drawn, the flow of dashes fades in.
    timeline.to(flows, {opacity: 1, duration: 0.6, stagger: 0.05}, ">");
  });
}

/**
 * Decorative diagrams: lines are drawn and points appear, in document order
 * (top to bottom), once the diagram scrolls into view. Converging circles
 * slide together.
 */
export function diagrams() {
  all('main [data-m="diagram"]').forEach((diagram) => {
    const lines = all('[data-m="draw"]', diagram);
    const points = all('[data-m="pop"]', diagram);
    const a = diagram.querySelector('[data-m="converge-a"]');
    const b = diagram.querySelector('[data-m="converge-b"]');

    gsap.set(lines, {strokeDasharray: "1 1", strokeDashoffset: 1});
    gsap.set(points, {opacity: 0, scale: 0.4, transformOrigin: "50% 50%", transformBox: "fill-box"});

    const timeline = gsap.timeline({
      scrollTrigger: {trigger: diagram, start: "top 85%", once: true}
    });

    if (a && b) {
      timeline.from(a, {x: -36, duration: DURATION.slow, ease: EASE}, 0);
      timeline.from(b, {x: 36, duration: DURATION.slow, ease: EASE}, 0);
    }

    timeline.to(
      lines,
      {strokeDashoffset: 0, duration: DURATION.slow, ease: EASE_EXPO, stagger: 0.06},
      0.1
    );
    timeline.to(
      points,
      {
        opacity: 1,
        scale: 1,
        duration: DURATION.fast,
        ease: EASE,
        stagger: {each: 0.012, from: "start"}
      },
      0.35
    );

    // A larger diagram takes its time: better seen, never slow to read past.
    if (diagram.hasAttribute("data-m-slow")) {
      timeline.timeScale(0.7);
    }
  });
}

/**
 * Coloured surfaces (stone, blue, gradient) arrive as an inset, rounded panel
 * and open to full width while they scroll into view: each section reads as
 * its own container. Scrubbed with the scroll; nothing is pinned.
 */
export function surfaces(desktop: boolean) {
  const inset = desktop ? "3%" : "2.5%";
  const radius = desktop ? "2rem" : "1.25rem";

  all('main [data-m="surface"]').forEach((surface) => {
    gsap.fromTo(
      surface,
      {clipPath: `inset(0% ${inset} 0% ${inset} round ${radius})`},
      {
        clipPath: "inset(0% 0% 0% 0% round 0rem)",
        ease: "none",
        scrollTrigger: {
          trigger: surface,
          start: "top bottom",
          end: "clamp(top 30%)",
          scrub: 0.4
        }
      }
    );
  });
}

/** Footer: logo and columns settle in as the footer comes into view. */
export function footer() {
  const element = all('footer[data-m="footer"]')[0];

  if (!element) {
    return;
  }

  const items = all('[data-m="footer-item"]', element);

  gsap.set(items, {opacity: 0, y: RISE});
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: DURATION.base,
    ease: EASE,
    stagger: 0.1,
    clearProps: CLEAR,
    scrollTrigger: {trigger: element, start: "clamp(top 85%)", once: true}
  });
}
