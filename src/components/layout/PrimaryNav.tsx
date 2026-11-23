import type {NavItem} from "@/lib/nav";
import {NavLink} from "./NavLink";

type Props = {
  items: NavItem[];
  label: string;
};

/** Desktop primary navigation: How We Work, Why Latin America, About. The logo links home. */
export function PrimaryNav({items, label}: Props) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.key}>
            <NavLink
              className="fill-down relative inline-flex min-h-11 items-center rounded-full px-4 text-ui-sm no-underline transition-colors duration-(--duration-fill) ease-(--ease-brand) after:absolute after:inset-x-4 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-gradient-x after:transition-transform after:duration-300 hover:text-alva-paper focus-visible:text-alva-paper aria-[current=page]:after:scale-x-100"
              href={item.href}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
