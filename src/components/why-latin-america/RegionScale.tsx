import type {Locale, WhyLatinAmericaContent} from "@/content/types";
import {ExpansionMap} from "@/components/map/ExpansionMap";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {SourceMarkers} from "@/components/ui/SourceMarkers";
import {SourceList} from "@/components/ui/SourceList";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: WhyLatinAmericaContent["scale"];
  locale: Locale;
};

/** "A region with scale": the population and GDP figures with their sources. */
export function RegionScale({content, locale}: Props) {
  const [lead, ...rest] = content.paragraphs;

  return (
    <Section shapes tone="gradient">
      <Container>
        <SplitLayout
          lead={
            <>
              <h2 className="text-display-2 text-balance">
                <Emphasis text={content.heading} />
              </h2>
              <ExpansionMap locale={locale} className="mx-auto mt-[clamp(2rem,4vw,3.5rem)] max-w-[34rem] lg:mx-0" />
            </>
          }
        >
          <div>
            {lead ? (
              <p className="text-lead text-pretty">
                {lead}
                <SourceMarkers
                  locale={locale}
                  sourceIds={content.sourceIds}
                  startAt={1}
                  tone="dark"
                />
              </p>
            ) : null}

            {rest.map((paragraph) => (
              <p className="mt-5 text-body text-pretty" key={paragraph}>
                {paragraph}
              </p>
            ))}

            <SourceList
              className="mt-8"
              locale={locale}
              note={content.sourceNote}
              sourceIds={content.sourceIds}
              startAt={1}
              tone="dark"
            />
          </div>
        </SplitLayout>
      </Container>
    </Section>
  );
}
