import type {HomeContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {Section} from "@/components/ui/Section";
import {TextLink} from "@/components/ui/TextLink";

type Props = {
  content: HomeContent["approach"];
  locale: Locale;
};

/** Validate, Build, Scale: the three stages in short. */
export function Approach({content, locale}: Props) {
  return (
    <Section>
      <Container>
        <h2 className="mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[22ch] text-display-2 text-balance">
          {content.heading}
        </h2>

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {content.items.map((item) => (
            <article
              className="relative border-t border-alva-stone pt-6"
              key={item.title}
            >
              <div
                aria-hidden="true"
                className="absolute -top-px left-0 h-0.5 w-10 bg-alva-green"
              />
              <h3 className="text-card-title">
                <EnglishTerm locale={locale}>{item.title}</EnglishTerm>
              </h3>
              <p className="mt-4 text-body text-pretty">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] border-t border-alva-stone pt-[clamp(1.5rem,3vw,2rem)]">
          <TextLink href={content.link.href}>{content.link.label}</TextLink>
        </div>
      </Container>
    </Section>
  );
}
