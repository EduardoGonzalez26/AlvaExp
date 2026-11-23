import {cn} from "@/lib/cn";

/**
 * Small decorative diagrams that sit under section headings and give the
 * longer text a visual anchor. They carry no information of their own (the
 * copy says everything), so they are aria-hidden and have no labels.
 *
 * All of them follow the brand transition: blue on top, green below. On scroll
 * their lines are drawn and their points appear from top to bottom (see
 * PageMotion › diagrams). Without motion they are simply shown complete.
 */

type Tone = "light" | "dark";

type Props = {
  tone?: Tone;
  className?: string;
};

const frame = "pointer-events-none mt-[clamp(2rem,4vw,3.5rem)] hidden w-full max-w-[22rem] sm:block";

function Gradient({id, tone, height}: {id: string; tone: Tone; height: number}) {
  const top = tone === "dark" ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const bottom = tone === "dark" ? "var(--color-alva-sage)" : "var(--color-alva-green)";

  return (
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id={id} x1="0" x2="0" y1="0" y2={height}>
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
  );
}

/**
 * Two circles that meet: your business and Alva. The overlap is filled with
 * the brand gradient. On scroll the circles slide together.
 */
export function ConvergeDiagram({tone = "light", className}: Props) {
  const id = `alva-converge-${tone}`;
  const ink = tone === "dark" ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const green = tone === "dark" ? "var(--color-alva-sage)" : "var(--color-alva-green)";

  return (
    <svg
      aria-hidden="true"
      className={cn(frame, className)}
      data-m="diagram"
      fill="none"
      focusable="false"
      viewBox="0 0 320 200"
    >
      <Gradient height={200} id={id} tone={tone} />
      <clipPath id={`${id}-clip`}>
        <circle cx="125" cy="100" r="80" />
      </clipPath>
      <g data-m="converge-a">
        <circle cx="125" cy="100" r="80" stroke={ink} strokeWidth="1.5" />
      </g>
      <g data-m="converge-b">
        <circle cx="195" cy="100" r="80" stroke={green} strokeWidth="1.5" />
        <circle
          clipPath={`url(#${id}-clip)`}
          cx="195"
          cy="100"
          data-m="pop"
          fill={`url(#${id})`}
          fillOpacity="0.9"
          r="80"
        />
      </g>
      <path d="M160 20v160" stroke={ink} strokeDasharray="3 5" strokeOpacity="0.5" />
    </svg>
  );
}

/**
 * A hub and the relationships around it: customers, partners, talent. Lines
 * are drawn from the centre outwards, top to bottom.
 */
export function NetworkDiagram({tone = "light", className}: Props) {
  const id = `alva-network-${tone}`;
  const ink = tone === "dark" ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const center = [160, 110] as const;
  const nodes = [
    [70, 30], [160, 14], [252, 34], [292, 112], [248, 190],
    [160, 206], [72, 188], [28, 110], [112, 66], [214, 150]
  ] as const;

  return (
    <svg
      aria-hidden="true"
      className={cn(frame, className)}
      data-m="diagram"
      fill="none"
      focusable="false"
      viewBox="0 0 320 220"
    >
      <Gradient height={220} id={id} tone={tone} />
      <g stroke={`url(#${id})`} strokeWidth="1.25">
        {nodes.map(([x, y]) => (
          <path d={`M${center[0]} ${center[1]}L${x} ${y}`} data-m="draw" key={`${x}-${y}`} pathLength={1} />
        ))}
        <path d="M70 30L112 66L160 14M252 34L292 112M248 190L214 150L292 112M72 188L28 110" data-m="draw" pathLength={1} strokeOpacity="0.45" />
      </g>
      {nodes.map(([x, y]) => (
        <circle cx={x} cy={y} data-m="pop" fill={`url(#${id})`} key={`n-${x}-${y}`} r="5" />
      ))}
      <circle cx={center[0]} cy={center[1]} data-m="pop" fill={ink} r="11" />
      <circle cx={center[0]} cy={center[1]} r="20" stroke={ink} strokeOpacity="0.4" />
    </svg>
  );
}

/**
 * Flows that come down from above and settle into one point: activity that
 * turns into an opportunity. Drawn from the top down.
 */
export function FlowDiagram({tone = "light", className}: Props) {
  const id = `alva-flow-${tone}`;
  const green = tone === "dark" ? "var(--color-alva-sage)" : "var(--color-alva-green)";
  const starts = [24, 76, 128, 192, 244, 296];

  return (
    <svg
      aria-hidden="true"
      className={cn(frame, className)}
      data-m="diagram"
      fill="none"
      focusable="false"
      viewBox="0 0 320 220"
    >
      <Gradient height={220} id={id} tone={tone} />
      <g stroke={`url(#${id})`} strokeWidth="1.5">
        {starts.map((x) => (
          <path d={`M${x} 0C${x} 110 160 110 160 186`} data-m="draw" key={x} pathLength={1} />
        ))}
      </g>
      <circle cx="160" cy="196" data-m="pop" fill={green} r="10" />
      <circle cx="160" cy="196" data-m="pop" r="20" stroke={green} strokeOpacity="0.5" />
    </svg>
  );
}

/**
 * A 10 × 10 grid where `value` cells are lit, filled row by row from the top
 * with the brand gradient. Used next to a percentage that the copy states.
 */
export function ShareGrid({value, tone = "light", className}: Props & {value: number}) {
  const id = `alva-share-${tone}`;
  const off = tone === "dark" ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const cells = Array.from({length: 100}, (_, index) => index);

  return (
    <svg
      aria-hidden="true"
      className={cn(frame, "max-w-[18rem]", className)}
      data-m="diagram"
      fill="none"
      focusable="false"
      viewBox="0 0 200 200"
    >
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={id} x1="0" x2="0" y1="0" y2="200">
          <stop offset="0" stopColor="var(--color-alva-blue)" />
          <stop offset="1" stopColor="var(--color-alva-green)" />
        </linearGradient>
      </defs>
      {cells.map((index) => {
        const x = (index % 10) * 20 + 10;
        const y = Math.floor(index / 10) * 20 + 10;
        const lit = index < value;

        return lit ? (
          <circle cx={x} cy={y} data-m="pop" fill={`url(#${id})`} key={index} r="6.5" />
        ) : (
          <circle cx={x} cy={y} key={index} r="6" stroke={off} strokeOpacity="0.35" />
        );
      })}
    </svg>
  );
}
