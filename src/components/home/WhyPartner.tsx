import type {HomeContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {CARD_IMAGES} from "@/content/media";
import {ExpandingCards} from "@/components/ui/ExpandingCards";
import {Section} from "@/components/ui/Section";

type Props = {
  content: HomeContent["whyPartner"];
};

export function WhyPartner({content}: Props) {
  return (
    <Section bordered>
      <Container>
        <h2 className="mb-heading max-w-[20ch] text-display-2 text-balance">
          <Emphasis text={content.heading} />
        </h2>

        <ExpandingCards images={CARD_IMAGES.whyPartner} items={content.items} />
      </Container>
    </Section>
  );
}
