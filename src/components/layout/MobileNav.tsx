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
 * returns focus to the button; a tap outside or tabbing out of the menu also
 * closes it, so it never covers the focused element (WCAG 2.4.11). It is a
 * plain disclosure, not a modal, so there is no focus trap.
 *
 * The panel is capped to the visible viewport and scrolls on its own, so every
 * item stays reachable in landscape or at 200 % zoom (WCAG 1.4.10). It enters
 * with the brand wipe: revealed from top to bottom.
 */
export function MobileNav({items, cta}: Props) {
  const t = useTranslations("Ui");
  const locale = useLocale();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // The menu is "open" only for the page and language it was opened on, so any
  // navigation (a link, or the language switch) closes it with no effect needed.
  const viewKey = `${locale}:${pathname}`;
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === viewKey;

  useEffect(() => {
    if (!open) {
      return;
    }

    const root = rootRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedOn(null);
        buttonRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (root && !root.contains(event.target as Node)) {
        setOpenedOn(null);
      }
    }

    function handleFocusOut(event: FocusEvent) {
      const next = event.relatedTarget as Node | null;
      // relatedTarget is null when focus leaves the document (tab switch):
      // keep the menu open in that case.
      if (root && next && !root.contains(next)) {
        setOpenedOn(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    root?.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      root?.removeEventListener("focusout", handleFocusOut);
    };
  }, [open]);

  return (
    <div className="lg:hidden" ref={rootRef}>
      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        className="group -mr-2 inline-flex min-h-11 items-center gap-3 rounded-lg px-2 font-mono text-eyebrow uppercase"
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
        className="absolute inset-x-0 top-full z-60 max-h-[calc(100dvh-var(--spacing-header)-1.25rem)] sm:max-h-[calc(100dvh-var(--spacing-header)-1.75rem)] overflow-y-auto overscroll-contain border-b-2 border-alva-green bg-alva-paper px-gutter pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] [clip-path:inset(0_0_0_0)] transition-[clip-path] duration-(--duration-fill) ease-(--ease-brand) starting:[clip-path:inset(0_0_100%_0)]"
        data-lenis-prevent
        hidden={!open}
        id="mobile-navigation"
      >
        <nav aria-label={t("primaryNavigation")}>
          <ul>
            {items.map((item, index) => (
              <li className="border-b border-alva-stone" key={item.key}>
                <NavLink
                  className="group/item flex min-h-14 items-center gap-4 py-2 font-serif text-2xl text-balance no-underline transition-colors duration-300 hover:text-alva-green aria-[current=page]:text-alva-green"
                  href={item.href}
                  onClick={() => setOpenedOn(null)}
                >
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 font-mono text-eyebrow text-alva-blue"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rotate-45 bg-brand-gradient opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 group-aria-[current=page]/item:opacity-100"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
          <LocaleSwitcher />
          <ButtonLink href={cta.href} size="small">
            {t("headerCta")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
