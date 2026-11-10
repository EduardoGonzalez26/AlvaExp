import type {HomeContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: HomeContent["sharedVision"];
};

export function SharedVision({content}: Props) {
  return (
    <Section bordered>
      <Container>
        <SplitLayout
          lead={<h2 className="text-display-2 text-balance">{content.heading}</h2>}
        >
          <Prose leadFirst paragraphs={content.paragraphs} />
        </SplitLayout>
      </Container>
    </Section>
  );
}
