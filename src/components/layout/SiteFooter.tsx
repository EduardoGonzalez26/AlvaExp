import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/content/types";
import {BRAND_DESCRIPTOR, COPYRIGHT} from "@/content/brand";
import {getNavigation, type NavItem} from "@/lib/nav";
import {contact} from "@/lib/site";
import {cn} from "@/lib/cn";
import {Container} from "@/components/ui/Container";
import {BrandLogo} from "./BrandLogo";

type Props = {
  locale: Locale;
};

const linkClass =
  "inline-block py-1.5 text-ui no-underline transition-colors duration-150 hover:text-alva-green hover:underline hover:underline-offset-[0.3em]";

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
    <nav aria-labelledby={id}>
      <p
        className="mb-4 text-ui-sm tracking-[0.16em] uppercase"
        id={id}
      >
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
 */
export async function SiteFooter({locale}: Props) {
  const t = await getTranslations({locale, namespace: "Ui"});
  const navigation = await getNavigation(locale);
  const hasContact = Boolean(contact.email || contact.phone);

  return (
    <footer className="border-t border-alva-stone bg-alva-paper text-alva-blue">
      <Container>
        <div
          className={cn(
            "grid gap-10 py-[clamp(3rem,6vw,5rem)] sm:grid-cols-2",
            hasContact
              ? "lg:grid-cols-[2fr_1fr_1fr_1fr]"
              : "lg:grid-cols-[2.5fr_1fr_1fr]"
          )}
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo />
            <p className="mt-3.5 text-ui-sm tracking-[0.08em]">
              {BRAND_DESCRIPTOR}
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
            <div>
              <p className="mb-4 text-ui-sm tracking-[0.16em] uppercase">
                {t("contact")}
              </p>
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

        <p className="border-t border-alva-stone py-6 text-caption">
          {COPYRIGHT}
        </p>
      </Container>
    </footer>
  );
}
