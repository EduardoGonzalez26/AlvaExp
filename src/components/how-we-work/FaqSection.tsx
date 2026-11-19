import type {HowWeWorkContent, Locale} from "@/content/types";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Faq} from "@/components/ui/Faq";
import {Section} from "@/components/ui/Section";
import {SplitLayout} from "@/components/ui/SplitLayout";

type Props = {
  content: HowWeWorkContent["faq"];
  locale: Locale;
};

export function FaqSection({content, locale}: Props) {
  return (
    <Section>
      <Container>
        <SplitLayout
          lead={<h2 className="text-display-2 text-balance"><Emphasis text={content.heading} /></h2>}
          ratio="wide"
        >
          <Faq items={content.items} locale={locale} />
        </SplitLayout>
      </Container>
    </Section>
  );
}
