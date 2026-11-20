import type {AboutContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {TeamGrid} from "@/components/ui/TeamGrid";

type Props = {
  content: AboutContent["team"];
  locale: Locale;
};

/**
 * "Meet the team" with the long approved bios. <TeamGrid> applies the Edgar
 * Hintze flag: one centered card when it is off, two equal cards when it is on.
 * No descriptors or personal-profile links are added.
 */
export function AboutTeam({content, locale}: Props) {
  return (
    <Section wave>
      <Container>
        <h2 className="mb-heading max-w-[20ch] text-display-2 text-balance">
          <Emphasis text={content.heading} />
        </h2>

        <TeamGrid locale={locale} profiles={content.profiles} />
      </Container>
    </Section>
  );
}
