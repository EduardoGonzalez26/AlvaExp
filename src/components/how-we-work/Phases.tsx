import type {HowWeWorkContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
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

/**
 * Validate (steps 1 to 3), Build (step 4) and Scale (step 5). Step numbers
 * are the brief's own; no other numbering is added to the page.
 */
export function Phases({phases, locale}: Props) {
  return (
    <>
      {phases.map((phase) => {
        const {stage, rest} = splitHeading(phase.heading);

        return (
          <section
            className="scroll-mt-4 border-t border-alva-stone py-[clamp(3.5rem,7vw,6.5rem)]"
            id={phase.id}
            key={phase.id}
          >
            <Container>
              <SplitLayout
                lead={
                  <h2 className="max-w-[18ch] text-title text-balance">
                    <EnglishTerm locale={locale}>{stage}</EnglishTerm>
                    {rest}
                  </h2>
                }
                ratio="wide"
                stickyLead
              >
                <div>
                  {phase.steps.map((step) => (
                    <article
                      className="border-t border-alva-stone py-[clamp(2rem,4vw,3.5rem)] first:border-t-0 first:pt-0"
                      key={step.name}
                    >
                      <h3 className="text-step-title">
                        <span className="text-alva-green">{step.number}</span>{" "}
                        <EnglishTerm locale={locale}>{step.name}</EnglishTerm>
                      </h3>
                      <div className="mt-6 grid max-w-[44rem] gap-5">
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
          </section>
        );
      })}
    </>
  );
}
