import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {getPathname, Link} from "@/i18n/navigation";
import type {Locale} from "@/content/types";
import {BRAND_DESCRIPTOR, COPYRIGHT} from "@/content/brand";
import {getNavigation, type NavItem} from "@/lib/nav";
import {contact} from "@/lib/site";
import {cn} from "@/lib/cn";
import {getSiteContent} from "@/content";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {Container} from "@/components/ui/Container";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {BrandLogo} from "./BrandLogo";
import {LocaleSwitcher} from "./LocaleSwitcher";

type Props = {
  locale: Locale;
};

/** Paper links with a rule that draws in from the left on hover. */
const linkClass =
  "relative inline-flex min-h-11 items-center text-ui no-underline after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-alva-paper after:transition-transform after:duration-300 after:ease-(--ease-brand) hover:after:scale-x-100 focus-visible:after:scale-x-100";

const labelClass = "mb-2 font-mono text-eyebrow uppercase";

function FooterColumn({
  id,
  title,
  items
}: {
  id: string;
  title: string;
  items: NavItem[];
}) {
  return (
    <nav aria-labelledby={id} data-m="footer-item">
      <p className={labelClass} id={id}>
        {title}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <Link className={linkClass} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Footer: brand, site navigation, legal links, optional contact details and
 * the minimal copyright. Empty contact fields are not rendered.
 *
 * It is where the page lands on the brand transition: blue at the top (so it
 * joins the blue closing panel without a seam) fading to green at the bottom.
 * Every text is paper, which keeps 6:1 or better over the whole gradient.
 * When it enters, the gradient is uncovered from top to bottom and the logo
 * and columns settle in (see PageMotion).
 */
export async function SiteFooter({locale}: Props) {
  const t = await getTranslations({locale, namespace: "Ui"});
  const nav = await getTranslations({locale, namespace: "Nav"});
  const navigation = await getNavigation(locale);
  const content = getSiteContent(locale);
  const hasContact = Boolean(contact.email || contact.phone);
  const howPath = getPathname({href: "/how-we-work", locale});

  // The method, from the site's own copy: stage name (English term) and the
  // phase it opens on How We Work, linked to that phase.
  const stages = content.howWeWork.phases.map((phase) => {
    const separator = phase.heading.indexOf(": ");
    const rest = separator === -1 ? "" : phase.heading.slice(separator + 2);
    const item = content.home.approach.items.find((entry) =>
      entry.title.toLowerCase().startsWith(phase.id)
    );

    return {
      id: phase.id,
      name: (item?.title ?? phase.id).replace(/\.$/, ""),
      caption: rest
    };
  });

  return (
    <footer
      className="relative isolate overflow-clip bg-alva-navy text-alva-paper"
      data-m="footer"
      data-surface="dark"
    >
      {/*
       * Brand strip on the top edge, as at the foot of the heroes: it closes
       * the blue CTA panel above and opens the footer, so the two never read
       * as one surface.
       */}
      <div aria-hidden="true" className="relative h-2 bg-brand-gradient-x" />

      {/* Oversized wordmark watermark along the bottom edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[3vw] -z-10 flex justify-center opacity-[0.07]"
      >
        <BrandLogo size="watermark" variant="dark" />
      </div>

      <Container>
        {/* Top band: descriptor, method formula and the conversation CTA. */}
        <div
          className="flex flex-col gap-8 border-b border-alva-paper/25 pt-[clamp(3.5rem,7vw,5.5rem)] pb-[clamp(2.5rem,5vw,3.5rem)] lg:flex-row lg:items-end lg:justify-between"
          data-m="footer-item"
        >
          <div>
            <BrandLogo size="xl" variant="dark" />
            <p className="mt-5 font-mono text-eyebrow">
              <EnglishTerm locale={locale}>{BRAND_DESCRIPTOR}</EnglishTerm>
            </p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <p className="font-serif text-title italic">
              <EnglishTerm locale={locale}>{content.home.hero.formula}</EnglishTerm>
            </p>
            <ButtonLink
              className="rounded-full!"
              href={navigation.cta.href}
              variant="inverse"
            >
              {t("headerCta")}
            </ButtonLink>
          </div>
        </div>

        <div
          className={cn(
            "grid grid-cols-2 gap-x-6 gap-y-10 py-[clamp(2.5rem,5vw,4rem)] sm:gap-x-10",
            hasContact
              ? "lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]"
              : "lg:grid-cols-[1.6fr_1fr_1fr_1fr]"
          )}
        >
          {/* Method: Validate · Build · Scale, each linked to its phase. */}
          <nav
            aria-labelledby="footer-method"
            className="col-span-2 lg:col-span-1"
            data-m="footer-item"
          >
            <p className={labelClass} id="footer-method">
              {nav("howWeWork")}
            </p>
            <ol className="grid gap-1">
              {stages.map((stage, index) => (
                <li key={stage.id}>
                  <a
                    className="group flex min-h-11 items-start gap-4 py-1.5 no-underline"
                    href={`${howPath}#${stage.id}`}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 font-mono text-caption text-alva-stone"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-serif text-xl underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-300 group-hover:decoration-alva-paper">
                        <EnglishTerm locale={locale}>{stage.name}</EnglishTerm>
                      </span>
                      {stage.caption ? (
                        <span className="text-ui-sm text-alva-stone">
                          {stage.caption}
                        </span>
                      ) : null}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <FooterColumn
            id="footer-navigation"
            items={navigation.footer}
            title={t("footerNavigation")}
          />
          <FooterColumn
            id="footer-legal"
            items={navigation.legal}
            title={t("legalNavigation")}
          />

          <div data-m="footer-item">
            <p className={labelClass}>{t("language")}</p>
            <LocaleSwitcher className="-ml-2" tone="dark" />
          </div>

          {hasContact ? (
            <div data-m="footer-item">
              <p className={labelClass}>{t("contact")}</p>
              <ul>
                {contact.email ? (
                  <li>
                    <a className={linkClass} href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.phone ? (
                  <li>
                    <a className={linkClass} href={`tel:${contact.phone}`}>
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-alva-paper/25 py-6 font-mono text-caption sm:flex-row sm:items-center sm:justify-between">
          <p>{COPYRIGHT}</p>
          {/* Site credit: Webi, the studio that built the site. */}
          <a
            className="group inline-flex min-h-11 items-center gap-3 self-start rounded-full no-underline sm:self-auto"
            href="https://webi.mx"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="flex items-center gap-3 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-80">
              <span aria-hidden="true" className="h-px w-6 bg-alva-paper/60 transition-[width] duration-300 group-hover:w-10" />
              <span lang="en">Powered by</span>
            </span>
            <Image
              alt="Webi"
              className="h-5 w-auto transition-transform duration-300 ease-(--ease-brand) group-hover:-translate-y-0.5"
              height={169}
              src="/brand/webi-logo-light.png"
              width={474}
            />
            <span className="sr-only"> {t("opensInNewTab")}</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
