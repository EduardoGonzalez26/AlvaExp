import type {HomeContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SourceMarkers} from "@/components/ui/SourceMarkers";
import {SourceNote} from "@/components/ui/SourceNote";
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

export function Region({content, locale}: Props) {
  const groups = statGroups(content.stat);

  return (
    <Section tone="blue">
      <Container>
        <SplitLayout
          lead={<h2 className="text-display-2 text-balance">{content.heading}</h2>}
        >
          <Prose className="text-alva-stone" paragraphs={content.paragraphs} />
        </SplitLayout>

        <div className="mt-[clamp(3rem,6vw,5rem)] border-t border-alva-stone pt-[clamp(2rem,4vw,3.5rem)]">
          {/*
            The figures are rendered verbatim. Each group is an inline-block so
            lines break between figures, not inside one. The source markers
            take the place of the brief's [D1, D2] identifiers.
          */}
          <p className="max-w-[30ch] text-stat">
            {groups.map((group, index) => (
              <span key={group}>
                {index > 0 ? " " : null}
                <span className="inline-block">{group}</span>
              </span>
            ))}
            <SourceMarkers
              locale={locale}
              sourceIds={content.sourceIds}
              tone="dark"
            />
          </p>

          <SourceNote className="mt-4" tone="dark">
            {content.sourceNote}
          </SourceNote>

          <TextLink className="mt-8" href={content.link.href} tone="dark">
            {content.link.label}
          </TextLink>
        </div>
      </Container>
    </Section>
  );
}
