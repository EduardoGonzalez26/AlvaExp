import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/content/types";
import {BRAND_DESCRIPTOR, COPYRIGHT} from "@/content/brand";
import {getNavigation, type NavItem} from "@/lib/nav";
import {contact} from "@/lib/site";
import {cn} from "@/lib/cn";
import {GradientCover, Lattice} from "@/components/ui/Backdrop";
import {Container} from "@/components/ui/Container";
import {EnglishTerm} from "@/components/ui/EnglishTerm";
import {BrandLogo} from "./BrandLogo";

type Props = {
  locale: Locale;
};

/** Paper links with a rule that draws in from the left on hover. */
const linkClass =
  "relative inline-block py-1.5 text-ui no-underline after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-alva-paper after:transition-transform after:duration-300 after:ease-(--ease-brand) hover:after:scale-x-100 focus-visible:after:scale-x-100";

const labelClass = "mb-4 font-mono text-eyebrow uppercase";

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
  const navigation = await getNavigation(locale);
  const hasContact = Boolean(contact.email || contact.phone);

  return (
    <footer
      className="relative isolate overflow-x-clip bg-brand-gradient text-alva-paper"
      data-m="footer"
      data-surface="dark"
    >
      <GradientCover />
      <Lattice />
      <Container>
        <div
          className={cn(
            "grid gap-10 pt-[clamp(3.5rem,7vw,6rem)] pb-[clamp(3rem,6vw,5rem)] sm:grid-cols-2",
            hasContact
              ? "lg:grid-cols-[2fr_1fr_1fr_1fr]"
              : "lg:grid-cols-[2.5fr_1fr_1fr]"
          )}
        >
          <div className="sm:col-span-2 lg:col-span-1" data-m="footer-item">
            <BrandLogo size="xl" variant="dark" />
            <p className="mt-5 font-mono text-eyebrow">
              <EnglishTerm locale={locale}>{BRAND_DESCRIPTOR}</EnglishTerm>
            </p>
          </div>

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

        <p className="border-t border-alva-paper/40 py-6 font-mono text-caption">
          {COPYRIGHT}
        </p>
      </Container>
    </footer>
  );
}
