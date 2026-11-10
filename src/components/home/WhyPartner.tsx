import type {HomeContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Section} from "@/components/ui/Section";

type Props = {
  content: HomeContent["whyPartner"];
};

export function WhyPartner({content}: Props) {
  return (
    <Section bordered>
      <Container>
        <h2 className="mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[20ch] text-display-2 text-balance">
          {content.heading}
        </h2>

        {/* Hairline grid: the stone background shows through 1px gaps. */}
        <div className="grid gap-px border border-alva-stone bg-alva-stone sm:grid-cols-2">
          {content.items.map((item) => (
            <article
              className="bg-alva-paper p-[clamp(1.75rem,3.5vw,3rem)]"
              key={item.title}
            >
              <div aria-hidden="true" className="mb-6 h-0.5 w-10 bg-alva-green" />
              <h3 className="max-w-[24ch] text-card-title">{item.title}</h3>
              <p className="mt-4 text-body text-pretty">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
