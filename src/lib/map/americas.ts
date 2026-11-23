/**
 * Geometry for the expansion map: a dot-matrix of the Americas from the
 * United States down to Patagonia, computed once at build time on the server.
 *
 * Outlines are simplified (lon, lat) polygons, accurate enough for a dot
 * grid; the projection is equirectangular. Nothing here reaches the client
 * except the resulting SVG path strings.
 */

type Point = readonly [lon: number, lat: number];

const LON_MIN = -127;
const LON_MAX = -33;
const LAT_MAX = 50;
const LAT_MIN = -56.5;
/** SVG units per degree. */
const K = 10;
/** Grid step in degrees. */
const STEP = 1.45;

export const MAP_WIDTH = (LON_MAX - LON_MIN) * K;
export const MAP_HEIGHT = (LAT_MAX - LAT_MIN) * K;
export const DOT_SIZE = STEP * K * 0.5;

export function project([lon, lat]: Point): [number, number] {
  return [(lon - LON_MIN) * K, (LAT_MAX - lat) * K];
}

const NORTH_AMERICA: Point[] = [
  [-124.7, 50], [-124.7, 48.4], [-124.2, 46], [-124, 42], [-123.8, 40],
  [-122.5, 37.8], [-120.6, 34.6], [-118.3, 34], [-117.1, 32.5], [-115.8, 30.4],
  [-114.2, 28], [-112.3, 26.5], [-110.3, 23.6], [-109.4, 23.2], [-110.6, 24.8],
  [-112.2, 28.9], [-114.7, 31.4], [-113, 31.2], [-111.5, 28.5], [-109.4, 26.5],
  [-108, 25], [-105.7, 22.5], [-105.3, 20], [-103.5, 18.3], [-101, 17.3],
  [-98.5, 16.3], [-96, 15.7], [-94, 16], [-92.2, 14.5], [-90, 13.7],
  [-87.5, 13], [-86, 11.5], [-85.7, 10], [-84, 9], [-82.5, 8.2], [-80, 7.3],
  [-78, 8.5], [-77.3, 8.2], [-77.5, 9.3], [-79.5, 9.6], [-81.5, 9],
  [-83.4, 10.8], [-83.7, 13], [-83.2, 15], [-85, 16], [-88, 15.8],
  [-88.3, 17.5], [-87.5, 19.5], [-86.8, 21.3], [-88, 21.5], [-90.4, 21],
  [-90.7, 19.5], [-92, 18.6], [-94.5, 18.2], [-96, 19], [-97.2, 21],
  [-97.7, 23], [-97.2, 26], [-97.4, 27.8], [-95, 29.3], [-93.5, 29.7],
  [-90, 29.1], [-89, 30.3], [-86, 30.4], [-84, 30], [-82.8, 27.8],
  [-81.7, 25.8], [-80.4, 25.2], [-80, 26.8], [-81, 29.5], [-81.4, 31],
  [-80.8, 32.2], [-79, 33.6], [-77, 34.8], [-75.6, 35.6], [-76, 37],
  [-75.2, 38.5], [-74, 40.4], [-72, 41], [-70, 41.7], [-70.6, 43], [-69, 44],
  [-67, 44.8], [-64.8, 45.3], [-61, 46], [-60, 47], [-64, 49], [-66, 50]
];

const SOUTH_AMERICA: Point[] = [
  [-77.3, 8.2], [-76, 9.4], [-75.5, 10.7], [-74.2, 11.3], [-72.3, 12],
  [-71.3, 11], [-70, 12.2], [-68, 10.6], [-66, 10.6], [-64, 10.6], [-62, 10.7],
  [-60.5, 8.4], [-58.5, 7], [-57, 6], [-54, 5.8], [-52, 4.7], [-50.5, 2],
  [-50, 0], [-48.5, -1.2], [-45, -1.5], [-42, -2.8], [-39, -3.5], [-37, -5],
  [-35.2, -6], [-34.8, -8], [-35.5, -9.5], [-37, -11], [-38.5, -13],
  [-39, -15.5], [-39.5, -18], [-40.5, -20.5], [-41.5, -22.5], [-44, -23],
  [-46.5, -24], [-48.5, -26], [-48.7, -28.5], [-50.5, -30.5], [-52.5, -33],
  [-53.5, -34], [-56, -34.9], [-57.5, -35.5], [-57.3, -37.5], [-62, -38.8],
  [-62.3, -40.8], [-65, -41], [-64.5, -42.5], [-65.5, -45], [-67.5, -46.5],
  [-66, -47.8], [-68.3, -50.2], [-69, -52], [-68.6, -53.5], [-67.5, -54.8],
  [-70, -55], [-72, -54], [-74, -52], [-75.4, -50], [-75.5, -47], [-74, -44],
  [-73.5, -41.5], [-73.7, -38], [-73, -36.5], [-71.7, -33], [-71.5, -29],
  [-70.9, -27], [-70.4, -23.5], [-70.2, -20], [-70.4, -18.3], [-72, -17],
  [-75, -15.5], [-76.3, -13.5], [-77.2, -12], [-79, -8], [-80.5, -6.5],
  [-81.2, -5], [-80.3, -3.4], [-80.5, -1.5], [-80, 0.5], [-79, 1.6],
  [-78.6, 2.6], [-77.5, 4], [-77.3, 6], [-77.8, 7.5]
];

const ISLANDS: Point[][] = [
  // Cuba
  [[-84.9, 21.9], [-82, 23.1], [-80, 23], [-77, 21.6], [-74.2, 20.2],
    [-75.5, 19.9], [-77.7, 19.9], [-78.5, 21.5], [-81, 22], [-83.5, 21.8]],
  // Hispaniola
  [[-74.4, 19.8], [-72, 19.9], [-70, 19.7], [-68.4, 18.6], [-70, 18.2],
    [-71.5, 17.6], [-73.4, 18.2], [-74.4, 18.4]],
  // Jamaica and Puerto Rico
  [[-78.4, 18.5], [-76.2, 18.4], [-76.2, 17.6], [-78.4, 17.9]],
  [[-67.3, 18.6], [-65.5, 18.6], [-65.5, 17.8], [-67.3, 17.8]]
];

function inside([x, y]: Point, polygon: Point[]): boolean {
  let hit = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]!;
    const [xj, yj] = polygon[j]!;

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      hit = !hit;
    }
  }

  return hit;
}

/** Approximate US–Mexico border: Pacific to El Paso, then the Rio Grande. */
const RIO_GRANDE: Point[] = [
  [-106.5, 31.8], [-104.5, 30], [-103, 29], [-101.4, 29.8], [-99.5, 27.5],
  [-97.2, 25.9]
];

function borderLat(lon: number): number {
  if (lon <= -111) return 32.5 - ((lon + 117.1) / 6.1) * 1.2;
  if (lon <= -106.5) return 31.3;

  for (let i = 1; i < RIO_GRANDE.length; i++) {
    const [lon1, lat1] = RIO_GRANDE[i - 1]!;
    const [lon2, lat2] = RIO_GRANDE[i]!;

    if (lon <= lon2) {
      return lat1 + ((lon - lon1) / (lon2 - lon1)) * (lat2 - lat1);
    }
  }

  return 25.9;
}

function isUnitedStates([lon, lat]: Point): boolean {
  return lat > 24.4 && lat > borderLat(lon) && lon < -66;
}

function dotPath(points: Point[]): string {
  return points
    .map((point) => {
      const [x, y] = project(point);
      return `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    })
    .join("");
}

function buildDots() {
  const north: Point[] = [];
  const latam: Point[] = [];

  for (let lat = LAT_MAX - STEP / 2; lat > LAT_MIN; lat -= STEP) {
    for (let lon = LON_MIN + STEP / 2; lon < LON_MAX; lon += STEP) {
      const point: Point = [lon, lat];
      const land =
        inside(point, NORTH_AMERICA) ||
        inside(point, SOUTH_AMERICA) ||
        ISLANDS.some((island) => inside(point, island));

      if (!land) continue;

      (inside(point, NORTH_AMERICA) && isUnitedStates(point) ? north : latam).push(
        point
      );
    }
  }

  return {north: dotPath(north), latam: dotPath(latam)};
}

/** Dot paths: one stroke path per group (round caps draw each dot). */
export const MAP_DOTS = buildDots();

export type Hub = {id: string; at: Point};

/** Departure points in the United States. */
export const ORIGINS: Hub[] = [
  {id: "nyc", at: [-74, 40.7]},
  {id: "mia", at: [-80.2, 25.8]},
  {id: "lax", at: [-118.2, 34]},
  {id: "hou", at: [-95.4, 29.8]}
];

/** Destinations across Latin America, ordered north to south. */
export const DESTINATIONS: Hub[] = [
  {id: "cdmx", at: [-99.1, 19.4]},
  {id: "bog", at: [-74.1, 4.7]},
  {id: "lim", at: [-77, -12]},
  {id: "sao", at: [-46.6, -23.5]},
  {id: "scl", at: [-70.7, -33.4]},
  {id: "bue", at: [-58.4, -34.6]}
];

const ROUTE_PAIRS: [origin: string, destination: string][] = [
  ["lax", "cdmx"],
  ["hou", "bog"],
  ["mia", "lim"],
  ["nyc", "sao"],
  ["mia", "scl"],
  ["nyc", "bue"]
];

/** Gentle arcs bowing east (towards the ocean), north to south. */
export const ROUTES = ROUTE_PAIRS.map(([from, to]) => {
  const a = project(ORIGINS.find((hub) => hub.id === from)!.at);
  const b = project(DESTINATIONS.find((hub) => hub.id === to)!.at);
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  // Perpendicular offset, always to the east (positive x).
  const sign = -dy >= 0 ? 1 : -1;
  const bend = 0.22 * sign;
  const [cx, cy] = [mx - dy * bend, my + dx * bend];

  return {
    id: `${from}-${to}`,
    d: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`,
    end: b
  };
});
