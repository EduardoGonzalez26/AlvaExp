import type {AboutContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {ConvergeDiagram} from "@/components/visuals/Diagrams";
import {Emphasis} from "@/components/ui/Emphasis";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: AboutContent["partnership"];
};

/** "What partnering with Alva means": one continuous statement. */
export function Partnership({content}: Props) {
  return (
    <Section tone="stone">
      <Container>
        <SplitLayout
          lead={
            <>
              <h2 className="text-display-2 text-balance">
                <Emphasis text={content.heading} />
              </h2>
              <ConvergeDiagram />
            </>
          }
        >
          <Prose leadFirst paragraphs={[content.body]} />
        </SplitLayout>
      </Container>
    </Section>
  );
}
