import type {Locale, WhyLatinAmericaContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {SourceMarkers} from "@/components/ui/SourceMarkers";
import {SourceNote} from "@/components/ui/SourceNote";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: WhyLatinAmericaContent["investment"];
  locale: Locale;
};

/** Foreign direct investment and what it means for an expanding business. */
export function Investment({content, locale}: Props) {
  const [lead, ...rest] = content.paragraphs;

  return (
    <Section tone="stone">
      <Container>
        <SplitLayout
          lead={<h2 className="text-display-2 text-balance"><Emphasis text={content.heading} /></h2>}
        >
          <div>
            {lead ? (
              <p className="text-lead text-pretty">
                {lead}
                <SourceMarkers
                  locale={locale}
                  sourceIds={content.sourceIds}
                  startAt={3}
                />
              </p>
            ) : null}

            {rest.map((paragraph) => (
              <p className="mt-5 text-body text-pretty" key={paragraph}>
                {paragraph}
              </p>
            ))}

            <SourceNote className="mt-6">{content.sourceNote}</SourceNote>
          </div>
        </SplitLayout>
      </Container>
    </Section>
  );
}
