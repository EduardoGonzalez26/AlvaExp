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

/** Delay before the hero signatures play, once the hero content is in. */
const SIGNATURE_START = 0.5;

/**
 * How We Work hero track: the progress line runs from dot to dot, pausing
 * on each one; every dot lights up with a ripple as the line reaches it and
 * its number, name and summary rise in. The line then runs out to the edge.
 * Below sm the line is hidden and the phases simply enter in order.
 */
function heroTrack(track: HTMLElement) {
  const line = track.querySelector<HTMLElement>('[data-m="track-line"]');
  const steps = all('[data-m="track-step"]', track);
  const timeline = gsap.timeline({delay: SIGNATURE_START});
  const lineWidth = line?.offsetWidth ?? 0;
  const drawLine = line !== null && lineWidth > 0;
  // Seconds between one phase lighting up and the next.
  const STEP = 0.65;

  if (drawLine) {
    timeline.set(line, {scaleX: 0, transformOrigin: "0% 50%"}, 0);
  }

  steps.forEach((step, index) => {
    const dot = step.querySelector<HTMLElement>('[data-m="track-dot"]');
    const core = step.querySelector<HTMLElement>('[data-m="track-core"]');
    const texts = all('[data-m="track-text"]', step);
    const summary = step.querySelector<HTMLElement>('[data-m="track-summary"]');
    const at = 0.1 + index * STEP;

    if (drawLine && dot && index > 0) {
      const centre = dot.getBoundingClientRect().left + dot.offsetWidth / 2;
      const fraction = (centre - line.getBoundingClientRect().left) / lineWidth;

      timeline.to(
        line,
        {scaleX: fraction, duration: STEP, ease: "power1.inOut"},
        at - STEP
      );
    }

    if (dot) {
      timeline.fromTo(
        dot,
        {scale: 0.3, opacity: 0, boxShadow: "0 0 0 0 rgba(134, 176, 160, 0.55)"},
        {
          scale: 1,
          opacity: 1,
          boxShadow: "0 0 0 16px rgba(134, 176, 160, 0)",
          duration: 0.7,
          ease: "back.out(2.2)",
          clearProps: "transform,opacity,boxShadow"
        },
        at
      );
    }

    if (core) {
      timeline.fromTo(
        core,
        {scale: 0},
        {scale: 1, duration: 0.35, ease: "back.out(3)", clearProps: "transform"},
        at + 0.1
      );
    }

    timeline.fromTo(
      texts,
      {yPercent: 110},
      {yPercent: 0, duration: DURATION.base, ease: EASE, stagger: 0.07, clearProps: "transform"},
      at + 0.05
    );

    if (summary) {
      timeline.fromTo(
        summary,
        {opacity: 0, y: RISE / 2},
        {opacity: 1, y: 0, duration: DURATION.base, ease: EASE, clearProps: CLEAR},
        at + 0.2
      );
    }
  });

  if (drawLine) {
    timeline.to(
      line,
      {scaleX: 1, duration: 0.8, ease: "power2.out", clearProps: "transform,transformOrigin"},
      0.1 + (steps.length - 1) * STEP + 0.1
    );
  }
}

/**
 * Counts a figure up from zero, keeping prefix, suffix, decimals and decimal
 * separator of the published value. data-value holds the published figure so
 * a rebuild halfway through (breakpoint change) never keeps a partial number.
 */
function countUp(element: HTMLElement, delay: number) {
  const final = element.dataset.value ?? element.textContent ?? "";
  const match = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/.exec(final);

  element.textContent = final;

  if (!match) {
    return;
  }

  const [, prefix = "", number = "0", suffix = ""] = match;
  const separator = number.includes(",") ? "," : ".";
  const decimals = number.split(/[.,]/)[1]?.length ?? 0;
  const target = Number.parseFloat(number.replace(",", "."));
  const counter = {value: 0};
  const format = (value: number) =>
    prefix + value.toFixed(decimals).replace(".", separator) + suffix;

  // Hold the final width so the layout does not shift while counting.
  element.style.minWidth = `${element.getBoundingClientRect().width}px`;
  element.textContent = format(0);

  gsap.to(counter, {
    value: target,
    duration: 2,
    ease: "expo.out",
    delay,
    onUpdate: () => {
      element.textContent = format(counter.value);
    },
    onComplete: () => {
      element.textContent = final;
      element.style.minWidth = "";
    }
  });
}

/**
 * Why Latin America hero figures: the rule is drawn, each figure rises out
 * of its mask while it counts up, then the labels and the source appear.
 */
function heroStats(section: HTMLElement) {
  const rule = section.querySelector<HTMLElement>('[data-m="stats-rule"]');
  const counts = all('[data-m="count"]', section);
  const labels = all('[data-m="stats-label"]', section);
  const note = section.querySelector<HTMLElement>('[data-m="stats-note"]');
  const timeline = gsap.timeline({delay: SIGNATURE_START});

  if (rule) {
    timeline.fromTo(
      rule,
      {scaleX: 0, transformOrigin: "0% 50%"},
      {scaleX: 1, duration: DURATION.slow, ease: EASE_EXPO, clearProps: "transform,transformOrigin"},
      0
    );
  }

  counts.forEach((count, index) => {
    const at = 0.2 + index * 0.18;

    timeline.fromTo(
      count,
      {yPercent: 100},
      {yPercent: 0, duration: DURATION.slow, ease: EASE_EXPO, clearProps: "transform"},
      at
    );
    countUp(count, SIGNATURE_START + at);
  });

  timeline.fromTo(
    labels,
    {opacity: 0, y: RISE / 2},
    {opacity: 1, y: 0, duration: DURATION.base, ease: EASE, stagger: 0.18, clearProps: CLEAR},
    0.55
  );

  if (note) {
    timeline.fromTo(
      note,
      {opacity: 0},
      {opacity: 1, duration: DURATION.base, ease: EASE, clearProps: "opacity"},
      1
    );
  }
}

/**
 * About hero diagram: each circle is drawn from its outer side while both
 * travel in from the edges; when they overlap the shared space fills with
 * the gradient and pulses once, the shared word rises from its mask and the
 * labels settle beside their circles.
 */
function heroVenn(venn: HTMLElement) {
  const left = venn.querySelector('[data-m="venn-a"]');
  const right = venn.querySelector('[data-m="venn-b"]');
  const strokes = venn.querySelectorAll('[data-m="venn-stroke"]');
  const shared = venn.querySelector('[data-m="venn-x"]');
  const caption = venn.querySelector('[data-m="venn-caption"]');
  const [first, second] = all('[data-m="venn-label"]', venn);
  // In viewBox units: far enough apart that the circles do not touch.
  const gap = 34;
  const travel = 1.5;

  const timeline = gsap
    .timeline({delay: SIGNATURE_START})
    .fromTo(
      strokes,
      // Dashed only while drawing: a resting dash leaves a seam on the circle.
      {strokeDasharray: "1 1", strokeDashoffset: 1},
      {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.inOut",
        clearProps: "strokeDasharray,strokeDashoffset"
      },
      0
    )
    .fromTo(left, {x: -gap}, {x: 0, duration: travel, ease: "power3.inOut"}, 0)
    .fromTo(right, {x: gap}, {x: 0, duration: travel, ease: "power3.inOut"}, 0)
    // Scaled from the centre of the overlap (viewBox 100,50), not the
    // circle's own box, which the clip would leave off-centre.
    .fromTo(
      shared,
      {opacity: 0, scale: 0.4, svgOrigin: "100 50"},
      {opacity: 1, scale: 1.08, duration: 0.55, ease: "power3.out"},
      travel - 0.25
    )
    .to(shared, {scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)"}, ">")
    .fromTo(
      caption,
      {yPercent: 110},
      {yPercent: 0, duration: DURATION.base, ease: EASE, clearProps: "transform"},
      travel - 0.05
    );

  if (first) {
    timeline.fromTo(
      first,
      {opacity: 0, x: 24},
      {opacity: 1, x: 0, duration: DURATION.base, ease: EASE, clearProps: CLEAR},
      travel
    );
  }

  if (second) {
    timeline.fromTo(
      second,
      {opacity: 0, x: -24},
      {opacity: 1, x: 0, duration: DURATION.base, ease: EASE, clearProps: CLEAR},
      travel + 0.1
    );
  }
}

/**
 * PageHero signatures, played once on load after the hero content enters.
 * The markup already holds the final state, so with reduced motion (nothing
 * runs) or without JavaScript every signature is simply shown complete.
 */
export function heroSignature() {
  const section = all('[data-m="hero"]')[0];

  if (!section) {
    return;
  }

  const track = section.querySelector<HTMLElement>('[data-m="track"]');
  const venn = section.querySelector<HTMLElement>('[data-m="venn"]');

  if (track) {
    heroTrack(track);
  }

  if (section.querySelector('[data-m="count"]')) {
    heroStats(section);
  }

  if (venn) {
    heroVenn(venn);
  }
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

    // Large diagrams (the Home 05 field) share a fixed total instead.
    const large = lines.length > 40;

    timeline.to(
      lines,
      {
        strokeDashoffset: 0,
        duration: DURATION.slow,
        ease: EASE_EXPO,
        stagger: large ? {amount: 2.4} : 0.06
      },
      0.1
    );
    timeline.to(
      points,
      {
        opacity: 1,
        scale: 1,
        duration: DURATION.fast,
        ease: EASE,
        stagger: large ? {amount: 1.6} : {each: 0.012, from: "start"}
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
 * Home 05 network field: once it has been drawn, the resting links dim and a
 * handful of links keep appearing and fading between random nearby points,
 * their two ends pulsing as they connect. Runs only while the field is in
 * view, and the button next to it pauses it for good (WCAG 2.2.2).
 *
 * Returns a cleanup for the button; the tweens are reverted by matchMedia.
 */
export function networkPulse() {
  const field = all('main [data-m-field]')[0];
  const toggle = all<HTMLButtonElement>('main [data-m="field-toggle"]')[0];

  // Hidden below `sm`: nothing to animate there.
  if (!field || !toggle || field.getBoundingClientRect().width === 0) {
    return undefined;
  }

  const rest = field.querySelector('[data-m="field-rest"]');
  const paths = all('[data-m="field-pulse"] path', field);
  const nodes = all("[data-node]", field).map((element) => ({
    element,
    x: Number(element.getAttribute("cx")),
    y: Number(element.getAttribute("cy"))
  }));

  // Candidate links: points close enough to read as neighbours.
  const pairs: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (j > i && distance > 40 && distance < 220) {
        pairs.push([i, j]);
      }
    });
  });

  if (!pairs.length) {
    return undefined;
  }

  const random = gsap.utils.random;
  const master = gsap.timeline({paused: true});
  let userPaused = false;
  let inView = false;

  // The resting network steps back once the first draw has finished.
  if (rest) {
    master.to(rest, {opacity: 0.35, duration: 1.2, ease: EASE}, 2.4);
  }

  const cycle = (path: HTMLElement, first: boolean) => {
    const [i, j] = pairs[Math.floor(random(0, pairs.length - 0.001))]!;
    const a = nodes[i]!;
    const b = nodes[j]!;
    const bend = random(-0.22, 0.22);
    const cx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
    const cy = (a.y + b.y) / 2 + (b.x - a.x) * bend;

    path.setAttribute("d", `M${a.x} ${a.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`);

    const step = gsap.timeline({
      onComplete: () => {
        master.remove(step);
        cycle(path, false);
      }
    });

    step
      .set(path, {strokeDasharray: "1 1", strokeDashoffset: 1}, first ? random(2.6, 5) : random(0.2, 1.6))
      .to(path, {strokeDashoffset: 0, duration: random(0.8, 1.3), ease: EASE})
      .to(
        [a.element, b.element],
        {scale: 1.6, duration: 0.3, ease: EASE, yoyo: true, repeat: 1, transformOrigin: "50% 50%", transformBox: "fill-box"},
        "<0.5"
      )
      .to(path, {strokeDashoffset: -1, duration: random(0.8, 1.3), ease: EASE}, `+=${random(0.6, 1.8)}`);

    master.add(step, master.time());
  };

  gsap.set(paths, {strokeDasharray: "1 1", strokeDashoffset: 1});
  paths.forEach((path) => cycle(path, true));

  const sync = () => {
    if (inView && !userPaused) {
      master.play();
    } else {
      master.pause();
    }
  };

  ScrollTrigger.create({
    trigger: field,
    start: "top 85%",
    end: "bottom top",
    onToggle: (self) => {
      inView = self.isActive;
      sync();
    }
  });

  const label = toggle.querySelector(".sr-only");
  const icons = {
    pause: toggle.querySelector('[data-icon="pause"]'),
    play: toggle.querySelector('[data-icon="play"]')
  };

  const render = () => {
    if (label) {
      label.textContent = (userPaused ? toggle.dataset.labelPlay : toggle.dataset.labelPause) ?? "";
    }

    icons.pause?.classList.toggle("hidden", userPaused);
    icons.play?.classList.toggle("hidden", !userPaused);
  };

  const onClick = () => {
    userPaused = !userPaused;
    render();
    sync();
  };

  toggle.addEventListener("click", onClick);
  toggle.setAttribute("data-ready", "");

  return () => {
    toggle.removeEventListener("click", onClick);
    toggle.removeAttribute("data-ready");
    userPaused = false;
    render();
  };
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

/**
 * Home box scroll (desktop only): the sections behave as the faces of a box
 * rolling upwards. Only faces marked data-box-out / data-box-in hinge (the
 * page decides which boundaries); the rest scroll flat. At each hinged
 * boundary the outgoing section tilts back on its
 * bottom edge while the incoming one straightens from its top edge; both
 * hinge on the shared edge, so the corner between them stays rigid (the two
 * angles always differ by ANGLE). The viewer sits at the centre of the
 * viewport: the container's perspective-origin follows the scroll.
 *
 * Each face is a wrapper (incoming tilt, hinged at its top) around the
 * section (outgoing tilt, hinged at its bottom), so a section shorter than
 * the viewport can do both at once. Rotations are computed from layout
 * offsets, not from ScrollTrigger tweens, and are zeroed on every refresh so
 * the other triggers on the page always measure the flat layout.
 *
 * Returns a cleanup for the refresh listeners; the inline styles are
 * recorded by the matchMedia context and reverted with it.
 */
export function boxScroll() {
  const box = all('main [data-m="box-scroll"]')[0];

  if (!box) {
    return undefined;
  }

  const ANGLE = 40;
  const faces = all(':scope > [data-m="box-face"]', box).map((face) => ({
    face,
    inner: face.firstElementChild as HTMLElement | null,
    tiltIn: face.hasAttribute("data-box-in"),
    tiltOut: face.hasAttribute("data-box-out"),
    top: 0,
    height: 0
  }));
  let boxTop = 0;

  const docTop = (element: HTMLElement) => {
    let top = 0;
    let node: HTMLElement | null = element;

    while (node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }

    return top;
  };

  gsap.set(box, {perspective: 1600});
  faces.forEach(({face, inner}) => {
    gsap.set(face, {transformStyle: "preserve-3d", transformOrigin: "50% 0%"});

    if (inner) {
      gsap.set(inner, {transformOrigin: "50% 100%"});
    }
  });

  const setters = faces.map(({face, inner}) => ({
    face: gsap.quickSetter(face, "rotationX", "deg"),
    inner: inner ? gsap.quickSetter(inner, "rotationX", "deg") : null
  }));

  const measure = () => {
    boxTop = docTop(box);
    faces.forEach((item) => {
      item.top = docTop(item.face);
      item.height = item.face.offsetHeight;
    });
  };

  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  const update = () => {
    const y = window.scrollY;
    const viewport = window.innerHeight;

    box.style.perspectiveOrigin = `50% ${y - boxTop + viewport / 2}px`;

    faces.forEach(({top, height, tiltIn, tiltOut}, index) => {
      const setter = setters[index];

      if (!setter) {
        return;
      }

      // Incoming: flat once its top edge reaches the top of the viewport.
      if (tiltIn) {
        const entered = clamp((y - (top - viewport)) / viewport);
        setter.face(-ANGLE * (1 - entered));
      }

      // Outgoing: fully tilted once its bottom edge reaches the top.
      if (tiltOut && setter.inner) {
        const left = clamp((y - (top + height - viewport)) / viewport);
        setter.inner(ANGLE * left);
      }
    });
  };

  const flatten = () => {
    setters.forEach((setter) => {
      setter.face(0);
      setter.inner?.(0);
    });
  };

  const onRefresh = () => {
    measure();
    update();
  };

  ScrollTrigger.addEventListener("refreshInit", flatten);
  ScrollTrigger.addEventListener("refresh", onRefresh);
  ScrollTrigger.create({
    trigger: box,
    start: "top bottom",
    end: "bottom top",
    // Refreshed last, so it never re-tilts a face while others measure.
    refreshPriority: -100,
    onUpdate: update
  });

  onRefresh();

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", flatten);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
  };
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
