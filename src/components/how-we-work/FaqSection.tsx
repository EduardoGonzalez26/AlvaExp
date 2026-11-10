import type {HowWeWorkContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Faq} from "@/components/ui/Faq";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: HowWeWorkContent["faq"];
};

export function FaqSection({content}: Props) {
  return (
    <Section>
      <Container>
        <SplitLayout
          lead={<h2 className="text-display-2 text-balance">{content.heading}</h2>}
          ratio="wide"
        >
          <Faq items={content.items} />
        </SplitLayout>
      </Container>
    </Section>
  );
}
