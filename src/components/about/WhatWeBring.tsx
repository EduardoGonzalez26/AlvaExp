import type {AboutContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {ItemGrid} from "@/components/ui/ItemGrid";
import {Section} from "@/components/ui/Section";

type Props = {
  content: AboutContent["together"];
};

/** The four capabilities Alva combines around an expansion. */
export function WhatWeBring({content}: Props) {
  return (
    <Section bordered>
      <Container>
        <h2 className="mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[20ch] text-display-2 text-balance">
          <Emphasis text={content.heading} />
        </h2>

        <ItemGrid items={content.items} />
      </Container>
    </Section>
  );
}
