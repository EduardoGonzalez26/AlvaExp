import type {ReactNode} from "react";
import {getTranslations} from "next-intl/server";
import type {Locale, SourceId} from "@/content/types";
import {SOURCES} from "@/content/sources";
import {cn} from "@/lib/cn";

type Props = {
  /** Sources in the order of their markers on the page. */
  sourceIds: SourceId[];
  locale: Locale;
  /** Number of the first source (it continues the page's count). */
  startAt?: number;
  /** The brief's published source note, rendered verbatim. */
  note?: ReactNode;
  /** "dark" is for blue and gradient sections. */
  tone?: "light" | "dark";
  className?: string;
};

const tones = {
  light: {
    root: "border-alva-blue/25 text-alva-blue",
    badge: "border-alva-blue",
    link: "hover:decoration-alva-green"
  },
  dark: {
    root: "border-alva-paper/35 text-alva-paper",
    badge: "border-alva-paper",
    link: "hover:decoration-alva-paper"
  }
} as const;

function host(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

/**
 * Footnote block for a data module: a mono "Sources" label, each numbered
 * source with its name and domain (linked, new tab), and the brief's source
 * note verbatim. The numbers match the badges next to the figures, so readers
 * can see what each one refers to without leaving the page.
 */
export async function SourceList({
  sourceIds,
  locale,
  startAt = 1,
  note,
  tone = "light",
  className
}: Props) {
  const ui = await getTranslations({locale, namespace: "Ui"});
  const sources = await getTranslations({locale, namespace: "Sources"});
  const t = tones[tone];

  return (
    <aside
      aria-label={ui("sourcesTitle")}
      className={cn("border-t pt-5", t.root, className)}
    >
      <p className="font-mono text-eyebrow uppercase">{ui("sourcesTitle")}</p>
      <ol
        className={cn(
          "mt-4 grid gap-3",
          sourceIds.length > 1 && "sm:grid-cols-2 sm:gap-x-8"
        )}
      >
        {sourceIds.map((sourceId, index) => {
          const {url} = SOURCES[sourceId];

          return (
            <li className="flex items-start gap-3" key={sourceId}>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.75rem] leading-none",
                  t.badge
                )}
              >
                {startAt + index}
              </span>
              <a
                className={cn(
                  "group inline-flex min-h-6 flex-col text-ui-sm underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200",
                  t.link
                )}
                href={url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>
                  {sources(sourceId)}{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                  <span className="sr-only"> {ui("opensInNewTab")}</span>
                </span>
                <span className="mt-0.5 font-mono text-[0.75rem] no-underline">
                  {host(url)}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      {note ? <p className="mt-4 text-caption">{note}</p> : null}
    </aside>
  );
}
