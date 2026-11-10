"use client";

import type {ReactNode} from "react";
import {Link, usePathname} from "@/i18n/navigation";
import type {RouteHref} from "@/content/types";

type Props = {
  href: RouteHref;
  children: ReactNode;
  /** Style the current page with the `aria-[current=page]:` variant. */
  className?: string;
  onClick?: () => void;
};

/**
 * Navigation link that marks the current page with `aria-current="page"`.
 * It is the only reason the primary navigation needs client JavaScript:
 * the current path is not known to a Server Component of the shared layout.
 */
export function NavLink({href, children, className, onClick}: Props) {
  const isCurrent = usePathname() === href;

  return (
    <Link
      aria-current={isCurrent ? "page" : undefined}
      className={className}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
