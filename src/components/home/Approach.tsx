import type {HomeContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {Section} from "@/components/ui/Section";
import {TextLink} from "@/components/ui/TextLink";

type Props = {
  content: HomeContent["approach"];
  locale: Locale;
};

/** Each stage takes a step along the blue to green transition. */
const STAGE_DOTS = ["bg-alva-blue", "bg-alva-teal", "bg-alva-green"] as const;

/**
 * Validate, Build, Scale: the three stages in short, as the deck's timeline.
 * A hairline carries the blue to green transition: top to bottom on small
 * screens, left to right once the stages sit in a row. Scrolling draws it and
 * switches the stage dots on in order (see PageMotion).
 */
export function Approach({content, locale}: Props) {
  return (
    <Section>
      <Container>
        <h2 className="mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[22ch] text-display-2 text-balance">
          <Emphasis text={content.heading} />
        </h2>

        <div className="relative" data-m="approach">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[0.4375rem] w-px bg-brand-gradient lg:inset-x-0 lg:top-[0.4375rem] lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:bg-brand-gradient-x"
            data-m="approach-line"
          />
          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-8" data-m="stagger">
          {content.items.map((item, index) => (
            <li
              className="group relative pl-10 lg:pt-12 lg:pl-0"
              key={item.title}
            >
              <span
                aria-hidden="true"
                className="absolute top-1 left-0 lg:top-0"
                data-m="approach-dot"
              >
                <span
                  className={`block size-3.5 rounded-full transition-transform duration-300 ease-(--ease-brand) group-hover:scale-150 ${STAGE_DOTS[index] ?? "bg-alva-green"}`}
                />
              </span>
              <h3 className="text-title">
                <EnglishTerm locale={locale}>{item.title}</EnglishTerm>
              </h3>
              <p className="mt-4 max-w-[36ch] text-body text-pretty">
                {item.body}
              </p>
            </li>
          ))}
          </ol>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] border-t border-alva-stone pt-[clamp(1.5rem,3vw,2rem)]">
          <TextLink href={content.link.href}>{content.link.label}</TextLink>
        </div>
      </Container>
    </Section>
  );
}
