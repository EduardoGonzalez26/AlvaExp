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
  /** "dark" is for blue and gradient sections. */
  tone?: "light" | "dark";
};

const tones = {
  light: {
    badge:
      "border-alva-blue text-alva-blue hover:border-transparent hover:bg-brand-gradient hover:text-alva-paper focus-visible:border-transparent focus-visible:bg-brand-gradient focus-visible:text-alva-paper",
    tip: "bg-alva-blue text-alva-paper"
  },
  dark: {
    badge:
      "border-alva-paper text-alva-paper hover:bg-alva-paper hover:text-alva-blue focus-visible:bg-alva-paper focus-visible:text-alva-blue",
    tip: "bg-alva-paper text-alva-blue"
  }
} as const;

/**
 * Source notes that replace the brief's `[D1, D2]` identifiers (which are
 * never shown). Each marker is a small numbered badge, like a report
 * footnote, that links to its source in a new tab. On hover or keyboard focus
 * a label names the source; the full list sits under the figures (see
 * SourceList). The accessible name starts with the visible number
 * (WCAG 2.5.3), and the badge has a taller invisible hit area for touch.
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
    <span className="ml-2 inline-flex translate-y-[-0.55em] gap-1 align-baseline font-sans text-[0.75rem] leading-none tracking-normal">
      {sourceIds.map((sourceId, index) => {
        const number = startAt + index;
        const name = sources(sourceId);

        return (
          <a
            aria-label={ui("sourceLink", {number, source: name})}
            className={cn(
              "group/source relative inline-flex size-6 items-center justify-center rounded-full border font-mono font-normal no-underline transition-colors duration-200 ease-(--ease-brand) after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']",
              tones[tone].badge
            )}
            href={SOURCES[sourceId].url}
            key={sourceId}
            rel="noopener noreferrer"
            target="_blank"
          >
            {number}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute right-[-0.375rem] bottom-full z-20 mb-2 hidden w-max max-w-[16rem] translate-y-1 sm:block rounded-md px-2.5 py-1.5 font-sans text-caption whitespace-nowrap opacity-0 transition-[opacity,transform] duration-200 ease-(--ease-brand) group-hover/source:translate-y-0 group-hover/source:opacity-100 group-focus-visible/source:translate-y-0 group-focus-visible/source:opacity-100",
                tones[tone].tip
              )}
            >
              {name} ↗
            </span>
          </a>
        );
      })}
    </span>
  );
}
