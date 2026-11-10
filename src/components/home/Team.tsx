import type {HomeContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Section} from "@/components/ui/Section";
import {TeamGrid} from "@/components/ui/TeamGrid";
import {TextLink} from "@/components/ui/TextLink";

type Props = {
  content: HomeContent["team"];
};

/**
 * "Meet the people behind Alva". Which profiles show is decided by the
 * NEXT_PUBLIC_SHOW_EDGAR_PROFILE flag inside <TeamGrid>.
 */
export function Team({content}: Props) {
  return (
    <Section>
      <Container>
        <h2 className="mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[20ch] text-display-2 text-balance">
          {content.heading}
        </h2>

        <TeamGrid profiles={content.profiles} />

        <div className="mt-[clamp(2.5rem,5vw,4rem)] border-t border-alva-stone pt-[clamp(1.5rem,3vw,2rem)]">
          <TextLink href={content.link.href}>{content.link.label}</TextLink>
        </div>
      </Container>
    </Section>
  );
}
