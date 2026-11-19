import type {Metadata} from "next";
import {getSiteContent} from "@/content";
import {getCountryOptions} from "@/lib/countries";
import {getTurnstileSiteKey} from "@/lib/contact/site-key";
import {resolveLocale} from "@/lib/locale";
import {buildPageMetadata} from "@/lib/seo";
import {ContactGuidance} from "@/components/contact/ContactGuidance";
import {ContactSection} from "@/components/contact/ContactSection";
import {PageHero} from "@/components/ui/PageHero";

type Props = {
  params: Promise<{locale: string}>;
};

/**
 * LAUNCH BLOCKER: this page stays `noindex` and outside the sitemap until:
 * 1. the Privacy Notice page is published, and
 * 2. real email delivery (Resend) is configured in production.
 *
 * At launch: remove `noindex: true` below and add "/start-a-conversation" to
 * `indexableRoutes` in src/app/sitemap.ts. Do not index it in staging.
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);

  return buildPageMetadata({
    locale,
    href: "/start-a-conversation",
    meta: getSiteContent(locale).startAConversation.meta,
    noindex: true
  });
}

/** Start a Conversation: hero, form, and the two closing guidance notes. */
export default async function StartAConversationPage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const content = getSiteContent(locale).startAConversation;
  const countryOptions = getCountryOptions(locale);
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <>
      <PageHero
        paragraphs={content.hero.paragraphs}
        title={content.hero.title}
      />
      <ContactSection
        content={content.form}
        countryOptions={countryOptions}
        locale={locale}
        turnstileSiteKey={turnstileSiteKey}
      />
      <ContactGuidance content={content} />
    </>
  );
}
