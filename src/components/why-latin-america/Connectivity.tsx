import type {Locale, WhyLatinAmericaContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {SourceMarkers} from "@/components/ui/SourceMarkers";
import {SourceNote} from "@/components/ui/SourceNote";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: WhyLatinAmericaContent["connectivity"];
  locale: Locale;
};

/** Internet adoption and how digital channels support a market entry. */
export function Connectivity({content, locale}: Props) {
  return (
    <Section>
      <Container>
        <SplitLayout
          lead={<h2 className="text-display-2 text-balance"><Emphasis text={content.heading} /></h2>}
        >
          <div>
            <p className="text-lead text-pretty">
              {content.stat}
              <SourceMarkers
                locale={locale}
                sourceIds={content.sourceIds}
                startAt={4}
              />{" "}
              {content.body}
            </p>

            <SourceNote className="mt-6">{content.sourceNote}</SourceNote>
          </div>
        </SplitLayout>
      </Container>
    </Section>
  );
}
