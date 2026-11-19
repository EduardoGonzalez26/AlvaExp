"use client";

import {useEffect, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname} from "@/i18n/navigation";
import type {NavItem} from "@/lib/nav";
import {ButtonLink} from "@/components/ui/ButtonLink";
import {LocaleSwitcher} from "./LocaleSwitcher";
import {NavLink} from "./NavLink";

type Props = {
  items: NavItem[];
  cta: NavItem;
};

/**
 * Small-screen navigation: a disclosure button (aria-expanded +
 * aria-controls) that reveals a panel under the header. Escape closes it and
 * returns focus to the button. It is a plain disclosure, not a modal, so there
 * is no focus trap and the rest of the page stays reachable.
 */
export function MobileNav({items, cta}: Props) {
  const t = useTranslations("Ui");
  const locale = useLocale();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // The menu is "open" only for the page and language it was opened on, so any
  // navigation (a link, or the language switch) closes it with no effect needed.
  const viewKey = `${locale}:${pathname}`;
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === viewKey;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedOn(null);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        className="group inline-flex min-h-11 items-center gap-3 font-mono text-eyebrow uppercase"
        onClick={() => setOpenedOn(open ? null : viewKey)}
        ref={buttonRef}
        type="button"
      >
        <span>{t("menu")}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1 bg-current transition-transform duration-150 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-45" />
          <span className="absolute inset-x-0 top-1/2 h-px translate-y-1 bg-current transition-transform duration-150 group-aria-expanded:translate-y-0 group-aria-expanded:-rotate-45" />
        </span>
      </button>

      <div
        className="absolute inset-x-0 top-full z-60 border-b-2 border-alva-green bg-alva-paper px-gutter pt-4 pb-8"
        hidden={!open}
        id="mobile-navigation"
      >
        <nav aria-label={t("primaryNavigation")}>
          <ul>
            {items.map((item) => (
              <li className="border-b border-alva-stone" key={item.key}>
                <NavLink
                  className="flex min-h-14 items-center font-serif text-2xl no-underline transition-colors duration-300 hover:text-alva-green aria-[current=page]:text-alva-green"
                  href={item.href}
                  onClick={() => setOpenedOn(null)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col items-stretch gap-5 sm:items-start">
          <LocaleSwitcher />
          <ButtonLink href={cta.href} size="small">
            {t("headerCta")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
