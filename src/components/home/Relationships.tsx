import type {HomeContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {NetworkField} from "@/components/visuals/Diagrams";
import {Emphasis} from "@/components/ui/Emphasis";
import {Prose} from "@/components/ui/Prose";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: HomeContent["relationships"];
};

export function Relationships({content}: Props) {
  return (
    <Section tone="stone">
      <Container>
        <SplitLayout
          lead={
            <h2 className="text-display-2 text-balance">
              <Emphasis text={content.heading} />
            </h2>
          }
          reveal={false}
        >
          <Prose leadFirst paragraphs={content.paragraphs} scrollReveal />
        </SplitLayout>
      </Container>

      {/* Full bleed: the network runs along the whole foot of the section. */}
      <div className="relative mt-[clamp(2.5rem,5vw,4.5rem)] -mb-[calc(var(--spacing-section)*0.6)]">
        <NetworkField />
        <button
          className="absolute right-gutter bottom-0 hidden size-11 items-center justify-center rounded-full border border-alva-blue/30 bg-alva-stone text-alva-blue transition-colors hover:bg-alva-paper data-[ready]:sm:flex"
          data-label-pause={content.motion.pause}
          data-label-play={content.motion.play}
          data-m="field-toggle"
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="currentColor" focusable="false" viewBox="0 0 16 16">
            <path d="M4 3h3v10H4zM9 3h3v10H9z" data-icon="pause" />
            <path className="hidden" d="M5 3l8 5-8 5z" data-icon="play" />
          </svg>
          <span className="sr-only">{content.motion.pause}</span>
        </button>
      </div>
    </Section>
  );
}
