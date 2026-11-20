import type {HowWeWorkContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {Section, type SectionTone} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  phases: HowWeWorkContent["phases"];
  locale: Locale;
};

/**
 * Splits a phase heading such as "VALIDATE: Understand the opportunity" into
 * the stage name and the rest, so the English stage name can be tagged
 * `lang="en"` on the Spanish site. The rendered text is unchanged.
 */
function splitHeading(heading: string): {stage: string; rest: string} {
  const separator = heading.indexOf(": ");

  return separator === -1
    ? {stage: heading, rest: ""}
    : {
        stage: heading.slice(0, separator),
        rest: heading.slice(separator)
      };
}

/** Light surfaces alternate so each stage reads as its own chapter. */
const PHASE_TONES: SectionTone[] = ["paper", "stone", "paper"];

/**
 * Validate (steps 1 to 3), Build (step 4) and Scale (step 5). Step numbers
 * are the brief's own; no other numbering is added to the page.
 *
 * The steps of a stage hang on a vertical rail that goes from blue (top) to
 * green (bottom): the brand transition read as progress. Scrolling draws the
 * rail downwards over a quiet track, each step enters as it crosses its dot,
 * and the dot of the step being read gets an outline ring (see PageMotion).
 */
export function Phases({phases, locale}: Props) {
  return (
    <>
      {phases.map((phase, index) => {
        const {stage, rest} = splitHeading(phase.heading);
        const tone = PHASE_TONES[index % PHASE_TONES.length] ?? "paper";
        const onStone = tone === "stone";

        return (
          <Section
            className="scroll-mt-28 py-[clamp(3.5rem,7vw,6.5rem)]"
            id={phase.id}
            index={false}
            key={phase.id}
            padded={false}
            tone={tone}
            wave={!onStone}
          >
            <Container>
              <SplitLayout
                lead={
                  <h2
                    className="max-w-[18ch] text-title text-balance"
                    data-m="reveal"
                  >
                    <span
                      className={`mb-4 block font-mono text-eyebrow ${
                        onStone ? "text-alva-blue" : "text-alva-green"
                      }`}
                    >
                      <EnglishTerm locale={locale}>{stage}</EnglishTerm>
                      {rest ? ":" : null}
                    </span>{" "}
                    <Emphasis text={rest.slice(2)} />
                  </h2>
                }
                ratio="wide"
                reveal={false}
                stickyLead
              >
                <div
                  className="relative grid gap-[clamp(2.5rem,5vw,4rem)] pl-8 sm:pl-12"
                  data-m="rail-group"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 bottom-2 left-1 w-0.5 rounded-full ${
                      onStone ? "bg-alva-paper" : "bg-alva-stone"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-2 bottom-2 left-1 w-0.5 rounded-full bg-brand-gradient"
                    data-m="rail"
                  />
                  {phase.steps.map((step) => (
                    <article
                      className="group/step relative"
                      data-m="step"
                      key={step.name}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute top-[0.7rem] -left-[2.0625rem] size-3 rounded-full bg-alva-green ring-4 outline-0 outline-offset-0 outline-alva-green transition-[outline-offset,outline-width] duration-(--duration-fill) ease-(--ease-brand) group-data-active/step:outline group-data-active/step:outline-offset-4 sm:-left-[3.0625rem] ${
                          onStone ? "ring-alva-stone" : "ring-alva-paper"
                        }`}
                        data-m="step-dot"
                      />
                      <h3 className="text-step-title">
                        <span className="text-alva-green">{step.number}</span>{" "}
                        <EnglishTerm locale={locale}>{step.name}</EnglishTerm>
                      </h3>
                      <div className="mt-5 grid max-w-[44rem] gap-5">
                        {step.paragraphs.map((paragraph) => (
                          <p className="text-body text-pretty" key={paragraph}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </SplitLayout>
            </Container>
          </Section>
        );
      })}
    </>
  );
}
