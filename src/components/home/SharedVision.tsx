import type {HomeContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {ConvergeDiagram} from "@/components/visuals/Diagrams";
import {Emphasis} from "@/components/ui/Emphasis";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: HomeContent["sharedVision"];
};

export function SharedVision({content}: Props) {
  return (
    <Section bordered wave>
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
          reveal={false}
        >
          <Prose leadFirst paragraphs={content.paragraphs} scrollReveal />
        </SplitLayout>
      </Container>
    </Section>
  );
}
