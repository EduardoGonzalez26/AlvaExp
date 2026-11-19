import type {StartAConversationContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: Pick<StartAConversationContent, "next" | "referral">;
};

/** The two closing editorial notes from section 5 of the brief. */
export function ContactGuidance({content}: Props) {
  return (
    <>
      <Section bordered tone="stone">
        <Container>
          <SplitLayout
            lead={
              <h2 className="text-display-2 text-balance">
                <Emphasis text={content.next.heading} />
              </h2>
            }
          >
            <p className="text-lead text-pretty">{content.next.body}</p>
          </SplitLayout>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SplitLayout
            lead={
              <h2 className="text-display-2 text-balance">
                <Emphasis text={content.referral.heading} />
              </h2>
            }
          >
            <p className="text-lead text-pretty">{content.referral.body}</p>
          </SplitLayout>
        </Container>
      </Section>
    </>
  );
}
