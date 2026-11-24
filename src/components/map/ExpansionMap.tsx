import {getTranslations} from "next-intl/server";
import type {Locale} from "@/content/types";
import {
  DOT_SIZE,
  MAP_DOTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ORIGINS,
  project,
  ROUTES
} from "@/lib/map/americas";
import {MapCanvas, type MapRoute} from "./MapCanvas";

type Props = {
  locale: Locale;
  /** "dark" for blue and gradient sections, "light" for paper and stone. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Expansion map: the Americas as a dot matrix, from the United States (top)
 * to Latin America (below), with arcs that carry a business south. It reads
 * the brand transition top to bottom. Decorative (aria-hidden): the section
 * copy says everything; the map only illustrates it.
 *
 * The geometry is computed on the server (src/lib/map/americas.ts) and the
 * city names come from the Map namespace; only plain strings and paths reach
 * the client canvas.
 */
/** Keys of the Map namespace (city names). */
type HubId =
  | "nyc"
  | "mia"
  | "lax"
  | "hou"
  | "cdmx"
  | "bog"
  | "lim"
  | "sao"
  | "scl"
  | "bue";

export async function ExpansionMap({locale, tone = "dark", className}: Props) {
  const t = await getTranslations({locale, namespace: "Map"});

  const routes: MapRoute[] = ROUTES.map((route) => {
    const [origin, destination] = route.id.split("-") as [HubId, HubId];
    const start = project(ORIGINS.find((hub) => hub.id === origin)!.at);

    return {
      id: route.id,
      d: route.d,
      start,
      end: route.end,
      from: t(origin),
      to: t(destination)
    };
  });

  const origins = ORIGINS.map((hub) => {
    const [x, y] = project(hub.at);
    return {id: hub.id, x, y};
  });

  return (
    <MapCanvas
      className={className}
      dotSize={DOT_SIZE}
      dotsLatam={MAP_DOTS.latam}
      dotsNorth={MAP_DOTS.north}
      height={MAP_HEIGHT}
      hint={t("hint")}
      origins={origins}
      routes={routes}
      tone={tone}
      width={MAP_WIDTH}
    />
  );
}
