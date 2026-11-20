import type {WhyLatinAmericaContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {ItemGrid} from "@/components/ui/ItemGrid";
import {Section} from "@/components/ui/Section";

type Props = {
  content: WhyLatinAmericaContent["marketMeaning"];
};

/** The four ways the region can translate into a commercial opportunity. */
export function MarketMeaning({content}: Props) {
  return (
    <Section>
      <Container>
        <h2 className="mb-heading max-w-[22ch] text-display-2 text-balance">
          <Emphasis text={content.heading} />
        </h2>

        <ItemGrid items={content.items} />
      </Container>
    </Section>
  );
}
