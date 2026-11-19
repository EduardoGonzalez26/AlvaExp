import {getTranslations} from "next-intl/server";
import type {Locale, SourceId} from "@/content/types";
import {SOURCES} from "@/content/sources";
import {cn} from "@/lib/cn";

type Props = {
  /** Sources that back the figure, in order. A note backing two figures lists both. */
  sourceIds: SourceId[];
  locale: Locale;
  /** Number shown on the first marker. Continue the count across a page. */
  startAt?: number;
  /** "dark" is for blue sections. */
  tone?: "light" | "dark";
};

const tones = {
  light: "text-alva-blue hover:text-alva-green",
  dark: "text-alva-paper hover:decoration-2"
} as const;

/**
 * Discreet superscript source notes that replace the brief's `[D1, D2]`
 * identifiers (which are never shown). Each marker links to its source in a
 * new tab. Markers are real 24 x 24 px targets (WCAG 2.5.8) and their
 * accessible name starts with the visible number (WCAG 2.5.3).
 */
export async function SourceMarkers({
  sourceIds,
  locale,
  startAt = 1,
  tone = "light"
}: Props) {
  const ui = await getTranslations({locale, namespace: "Ui"});
  const sources = await getTranslations({locale, namespace: "Sources"});

  return (
    <sup className="top-0 ml-1.5 inline-flex gap-0.5 align-super text-[max(0.75rem,0.3em)] leading-none">
      {sourceIds.map((sourceId, index) => {
        const number = startAt + index;

        return (
          <a
            aria-label={ui("sourceLink", {
              number,
              source: sources(sourceId)
            })}
            className={cn(
              "inline-flex min-h-6 min-w-6 items-center justify-center font-medium underline decoration-1 underline-offset-4 transition-colors duration-150",
              tones[tone]
            )}
            href={SOURCES[sourceId].url}
            key={sourceId}
            rel="noopener noreferrer"
            target="_blank"
          >
            {number}
          </a>
        );
      })}
    </sup>
  );
}
