import type {Locale, WhyLatinAmericaContent} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {ItemGrid} from "@/components/ui/ItemGrid";
import {Section} from "@/components/ui/Section";

type Props = {
  content: WhyLatinAmericaContent["examples"];
  locale: Locale;
};

/**
 * Illustrative scenarios. The editorial label is published verbatim, so the
 * examples are never mistaken for clients or completed work.
 */
export function Examples({content, locale}: Props) {
  return (
    <Section tone="stone">
      <Container>
        <div className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <h2 className="text-display-2 text-balance lg:col-span-6">
            <Emphasis text={content.heading} />
          </h2>
          <p className="max-w-[48ch] text-ui text-pretty lg:col-span-5 lg:col-start-8">
            {content.label}
          </p>
        </div>

        <ItemGrid
          columns={3}
          items={content.items}
          locale={locale}
          tone="stone"
        />
      </Container>
    </Section>
  );
}
