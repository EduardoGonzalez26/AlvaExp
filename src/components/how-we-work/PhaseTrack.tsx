import type {PhaseContent} from "@/content/types";

type Props = {
  phases: PhaseContent[];
  label: string;
};

/**
 * How We Work hero signature: the three phases as a numbered track, each one
 * linked to its section. A faint base line carries a brighter progress line
 * that joins the dots; each dot has a core that marks the phase as reached.
 * The markup is the final state; heroSignature() plays it on load.
 */
export function PhaseTrack({phases, label}: Props) {
  return (
    <nav aria-label={label} data-m="track">
      <ol className="relative grid gap-7 sm:grid-cols-3 sm:gap-8">
        {/* Base and progress lines, through the centre of the dots. */}
        <span
          aria-hidden="true"
          className="absolute top-3 right-0 left-0 hidden h-px bg-alva-stone/25 sm:block"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 right-0 left-0 hidden h-px bg-linear-to-r from-alva-paper via-alva-sage to-alva-sage/0 sm:block"
          data-m="track-line"
        />
        {phases.map((phase, index) => {
          const [name = phase.id, ...rest] = phase.heading.split(":");
          const summary = rest.join(":").trim();

          return (
            <li className="relative" data-m="track-step" key={phase.id}>
              <a
                className="group flex gap-4 sm:flex-col sm:gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alva-paper"
                href={`#${phase.id}`}
              >
                <span
                  aria-hidden="true"
                  className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full border border-alva-paper bg-alva-blue transition-transform duration-300 group-hover:scale-125"
                  data-m="track-dot"
                >
                  <span className="size-2 rounded-full bg-alva-sage" data-m="track-core" />
                </span>
                <span className="flex max-w-[22rem] flex-col gap-1.5">
                  <span className="overflow-hidden">
                    <span className="block text-eyebrow uppercase text-alva-stone" data-m="track-text">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="overflow-hidden pb-[0.1em]">
                    <span
                      className="block font-serif text-card-title transition-colors group-hover:text-alva-sage"
                      data-m="track-text"
                    >
                      {name.charAt(0) + name.slice(1).toLowerCase()}
                    </span>
                  </span>
                  {summary ? (
                    <span className="text-ui-sm font-normal text-alva-stone xl:text-ui" data-m="track-summary">
                      {summary}
                    </span>
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
