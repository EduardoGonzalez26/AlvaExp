import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import type {ContactFormContent, Locale} from "@/content/types";
import type {CountryOption} from "@/lib/countries";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {ContactForm} from "./ContactForm";

type Props = {
  content: ContactFormContent;
  locale: Locale;
  countryOptions: CountryOption[];
  turnstileSiteKey: string | null;
};

/**
 * Form block: editorial heading and introduction on the left, form on the
 * right. Only the ContactForm namespace travels to the browser through a
 * nested provider; the rest of the page stays a Server Component.
 */
export async function ContactSection({
  content,
  locale,
  countryOptions,
  turnstileSiteKey
}: Props) {
  const messages = await getMessages({locale});

  return (
    <Section bordered>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2
                className="text-display-2 text-balance"
                id="contact-form-heading"
              >
                <Emphasis text={content.heading} />
              </h2>
              <p
                className="mt-6 max-w-[44ch] text-lead text-pretty"
                data-m="reveal"
              >
                {content.introduction}
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8 lg:col-start-5" data-m="reveal">
            <NextIntlClientProvider
              messages={{ContactForm: messages.ContactForm}}
            >
              <ContactForm
                content={content}
                countryOptions={countryOptions}
                locale={locale}
                turnstileSiteKey={turnstileSiteKey}
              />
            </NextIntlClientProvider>
          </div>
        </div>
      </Container>
    </Section>
  );
}
