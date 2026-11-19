import {getLocale, getTranslations} from "next-intl/server";
import {Container} from "@/components/ui/Container";
import {Emphasis} from "@/components/ui/Emphasis";
import {Section} from "@/components/ui/Section";
import {TextLink} from "@/components/ui/TextLink";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({locale, namespace: "Ui"});

  return (
    <Section className="min-h-[58vh]" index={false} wave>
      <Container>
        <h1 className="max-w-[20ch] text-display-2 text-balance">
          <Emphasis text={t("notFoundTitle")} />
        </h1>
        <p className="mt-6 mb-9 max-w-xl text-body">{t("notFoundDescription")}</p>
        <TextLink href="/">{t("backToHome")}</TextLink>
      </Container>
    </Section>
  );
}
