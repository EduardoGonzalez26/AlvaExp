import {Fragment} from "react";
import type {HomeContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SourceMarkers} from "@/components/ui/SourceMarkers";
import {SourceList} from "@/components/ui/SourceList";
import {SplitLayout} from "@/components/ui/SplitLayout";
import {TextLink} from "@/components/ui/TextLink";

type Props = {
  content: HomeContent["region"];
  locale: Locale;
};

/** Splits "A · B" into groups that wrap as units, keeping each separator with the group before it. */
function statGroups(stat: string): string[] {
  const parts = stat.split(" · ");

  return parts.map((part, index) =>
    index < parts.length - 1 ? `${part} ·` : part
  );
}

/**
 * The region's key figures on the brand gradient: blue at the top, green at
 * the bottom of the section. When it enters, the gradient is uncovered from
 * top to bottom and each figure's rule is drawn; the figures themselves are
 * never counted or altered (see PageMotion).
 */
export function Region({content, locale}: Props) {
  const groups = statGroups(content.stat);
  // One source per figure (population, GDP): each badge sits on its figure.
  const perFigure = content.sourceIds.length === groups.length;

  return (
    <Section shapes tone="gradient">
      <Container>
        <SplitLayout
          lead={
            <h2 className="text-display-2 text-balance">
              <Emphasis text={content.heading} />
            </h2>
          }
        >
          <Prose locale={locale} paragraphs={content.paragraphs} />
        </SplitLayout>

        <div className="mt-[clamp(3rem,6vw,5rem)]">
          {/*
            The figures are rendered verbatim. Each group sits under its own
            hairline and is an inline-block, so lines break between figures,
            not inside one. The source badges take the place of the brief's
            [D1, D2] identifiers: one per figure, listed under them.
          */}
          <p
            className="grid gap-x-8 gap-y-6 font-serif text-stat sm:grid-cols-2"
            data-m="stats"
          >
            {groups.map((group, index) => (
              <Fragment key={group}>
                {index > 0 ? " " : null}
                <span className="relative pt-[clamp(1.25rem,2.5vw,2rem)]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-alva-paper/40"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-0.5 w-24 -translate-y-px bg-alva-paper"
                    data-m="stat-rule"
                  />
                  <span className="block" data-m="stat-text">
                    {group.endsWith(" ·") ? (
                      <>
                        {group.slice(0, -2)}{" "}
                        <span className="text-alva-stone">·</span>
                      </>
                    ) : (
                      group
                    )}
                    {perFigure ? (
                      <SourceMarkers
                        locale={locale}
                        sourceIds={[content.sourceIds[index]!]}
                        startAt={index + 1}
                        tone="dark"
                      />
                    ) : index === groups.length - 1 ? (
                      <SourceMarkers
                        locale={locale}
                        sourceIds={content.sourceIds}
                        tone="dark"
                      />
                    ) : null}
                  </span>
                </span>
              </Fragment>
            ))}
          </p>

          <div data-m="reveal">
            <SourceList
              className="mt-8"
              locale={locale}
              note={content.sourceNote}
              sourceIds={content.sourceIds}
              tone="dark"
            />

            <TextLink className="mt-8" href={content.link.href} tone="dark">
              {content.link.label}
            </TextLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
