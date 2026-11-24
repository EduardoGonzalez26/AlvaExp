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
 *
 * `dense` is the wider constellation used on Home 05: an asymmetric network
 * of three clusters around the hub, satellites at the edges and a few long
 * curved links between regions. `slow` lengthens the drawing (PageMotion).
 */

type NodeSpec = {at: readonly [number, number]; r: number; soft?: boolean};
type LinkSpec = {d: string; opacity?: number};

/** Curved link between two points, bowing to one side. */
function curve(
  [x1, y1]: readonly [number, number],
  [x2, y2]: readonly [number, number],
  bend = 0.2
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = mx - (y2 - y1) * bend;
  const cy = my + (x2 - x1) * bend;
  return `M${x1} ${y1}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
}

const DENSE_NODES: NodeSpec[] = [
  // Clusters (upper left, upper right, lower right) and the main hub.
  {at: [58, 58], r: 4},
  {at: [92, 42], r: 3},
  {at: [128, 32], r: 5},
  {at: [66, 104], r: 3},
  {at: [40, 86], r: 2.5, soft: true},
  {at: [238, 48], r: 4},
  {at: [272, 66], r: 3},
  {at: [292, 102], r: 5},
  {at: [214, 66], r: 3},
  {at: [214, 18], r: 2.5, soft: true},
  {at: [188, 222], r: 3},
  {at: [232, 232], r: 5},
  {at: [258, 204], r: 3},
  {at: [272, 170], r: 4},
  {at: [246, 150], r: 3},
  // Edge satellites.
  {at: [34, 150], r: 2.5, soft: true},
  {at: [44, 208], r: 2.5, soft: true},
  {at: [150, 236], r: 2.5, soft: true},
  {at: [300, 140], r: 2.5, soft: true},
  {at: [300, 30], r: 2.5, soft: true},
  {at: [150, 18], r: 2.5, soft: true},
  // Secondary hubs that carry their cluster.
  {at: [104, 78], r: 7},
  {at: [216, 186], r: 7}
];

const DENSE_LINKS: LinkSpec[] = [
  // Hub to the two secondary hubs.
  {d: curve([160, 130], [104, 78], 0.12)},
  {d: curve([160, 130], [216, 186], 0.12)},
  // Upper-left cluster.
  {d: "M104 78L58 58"},
  {d: "M104 78L92 42"},
  {d: "M104 78L128 32"},
  {d: "M104 78L66 104"},
  {d: "M104 78L40 86", opacity: 0.5},
  // Upper-right cluster, reached through its own node.
  {d: curve([160, 130], [214, 66], 0.16)},
  {d: "M214 66L238 48"},
  {d: "M214 66L272 66"},
  {d: "M214 66L292 102"},
  {d: "M238 48L214 18", opacity: 0.5},
  {d: "M292 102L300 140", opacity: 0.5},
  // Lower-right cluster.
  {d: curve([160, 130], [216, 186], 0.12)},
  {d: "M216 186L188 222"},
  {d: "M216 186L232 232"},
  {d: "M216 186L258 204"},
  {d: "M216 186L272 170"},
  {d: "M216 186L246 150"},
  {d: "M232 232L258 204", opacity: 0.45},
  // Edge satellites.
  {d: "M160 130L34 150", opacity: 0.5},
  {d: "M160 130L44 208", opacity: 0.5},
  {d: "M160 130L150 236", opacity: 0.4},
  {d: "M272 170L300 140", opacity: 0.45},
  {d: "M238 48L300 30", opacity: 0.45},
  {d: curve([160, 130], [150, 18], 0.14), opacity: 0.4},
  // Long links between regions: reach beyond the closest cluster.
  {d: curve([128, 32], [238, 48], 0.18), opacity: 0.35},
  {d: curve([44, 208], [188, 222], 0.16), opacity: 0.35},
  {d: "M34 150L44 208", opacity: 0.4},
  {d: curve([44, 208], [150, 236], 0.12), opacity: 0.35},
  {d: "M150 236L188 222", opacity: 0.4},
  {d: curve([292, 102], [272, 170], 0.18), opacity: 0.35}
];

export function NetworkDiagram({
  tone = "light",
  dense = false,
  slow = false,
  className
}: Props & {dense?: boolean; slow?: boolean}) {
  const id = `alva-network-${tone}`;
  const ink = tone === "dark" ? "var(--color-alva-paper)" : "var(--color-alva-blue)";
  const center = [160, 130] as const;

  const nodes: NodeSpec[] = dense
    ? DENSE_NODES
    : [
        {at: [70, 30], r: 5},
        {at: [160, 14], r: 5},
        {at: [252, 34], r: 5},
        {at: [292, 112], r: 5},
        {at: [248, 190], r: 5},
        {at: [160, 206], r: 5},
        {at: [72, 188], r: 5},
        {at: [28, 110], r: 5},
        {at: [112, 66], r: 5},
        {at: [214, 150], r: 5}
      ];

  const links: LinkSpec[] = dense
    ? DENSE_LINKS
    : [
        ...nodes.map(({at}) => ({
          d: `M${center[0]} ${center[1]}L${at[0]} ${at[1]}`
        })),
        {
          d: "M70 30L112 66L160 14M252 34L292 112M248 190L214 150L292 112M72 188L28 110",
          opacity: 0.45
        }
      ];

  return (
    <svg
      aria-hidden="true"
      className={cn(frame, className)}
      data-m="diagram"
      data-m-slow={slow ? "" : undefined}
      fill="none"
      focusable="false"
      viewBox={dense ? "0 0 320 260" : "0 0 320 220"}
    >
      <Gradient height={dense ? 260 : 220} id={id} tone={tone} />

      <g stroke={`url(#${id})`} strokeWidth="1.25">
        {links.map((link, index) => (
          <path
            d={link.d}
            data-m="draw"
            key={`${link.d}-${index}`}
            pathLength={1}
            strokeOpacity={link.opacity}
          />
        ))}
      </g>

      {nodes.map(({at, r, soft}) => (
        <circle
          cx={at[0]}
          cy={at[1]}
          data-m="pop"
          fill={soft ? ink : `url(#${id})`}
          fillOpacity={soft ? 0.55 : undefined}
          key={`n-${at[0]}-${at[1]}`}
          r={r}
        />
      ))}

      <circle cx={center[0]} cy={center[1]} data-m="pop" fill={ink} r={dense ? 12 : 11} />
      <circle
        cx={center[0]}
        cy={center[1]}
        r={dense ? 22 : 20}
        stroke={ink}
        strokeOpacity="0.4"
      />
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
