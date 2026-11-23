import type {HowWeWorkContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {NetworkDiagram} from "@/components/visuals/Diagrams";
import {Emphasis} from "@/components/ui/Emphasis";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: HowWeWorkContent["connected"];
};

/** "A team that stays connected to the business". */
export function ConnectedTeam({content}: Props) {
  return (
    <Section tone="stone">
      <Container>
        <SplitLayout
          lead={
            <>
              <h2 className="text-display-2 text-balance">
                <Emphasis text={content.heading} />
              </h2>
              <NetworkDiagram />
            </>
          }
        >
          <Prose leadFirst paragraphs={content.paragraphs} />
        </SplitLayout>
      </Container>
    </Section>
  );
}
