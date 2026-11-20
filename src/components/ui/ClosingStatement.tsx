import {Container} from "./Container";
import {Emphasis} from "./Emphasis";
import {Section} from "./Section";
import {SplitLayout} from "./SplitLayout";

type Props = {
  heading: string;
  body: string;
  /** Hairline above, to separate it from a preceding paper section. */
  bordered?: boolean;
};

/**
 * Last editorial statement before the closing brand panel. It keeps only the
 * bottom padding that separates it from the blue CTA band below.
 */
export function ClosingStatement({heading, body, bordered = false}: Props) {
  return (
    <Section
      bordered={bordered}
      className="pt-section pb-[clamp(2.5rem,5vw,4rem)]"
      padded={false}
      wave
    >
      <Container>
        <SplitLayout
          lead={
            <h2 className="text-display-2 text-balance">
              <Emphasis text={heading} />
            </h2>
          }
          reveal={false}
        >
          <p className="text-lead text-pretty" data-m="reveal">
            {body}
          </p>
        </SplitLayout>
      </Container>
    </Section>
  );
}
