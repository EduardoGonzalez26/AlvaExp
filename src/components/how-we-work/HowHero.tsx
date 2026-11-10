import type {HowWeWorkContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Prose} from "@/components/ui/Prose";

type Props = {
  content: HowWeWorkContent["hero"];
};

export function HowHero({content}: Props) {
  return (
    <section className="pt-[clamp(3.5rem,7vw,6.5rem)] pb-[clamp(3rem,6vw,5rem)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <h1 className="min-w-0 text-display-1 text-balance lg:col-span-7 lg:pr-8">
            {content.title}
          </h1>

          <div className="min-w-0 border-t border-alva-stone pt-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            <Prose leadFirst paragraphs={content.paragraphs} />
          </div>
        </div>
      </Container>
    </section>
  );
}
