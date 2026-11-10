import type {NavItem} from "@/lib/nav";
import {NavLink} from "./NavLink";

type Props = {
  items: NavItem[];
  label: string;
};

/** Desktop primary navigation: Home, How We Work, Why Latin America, About. */
export function PrimaryNav({items, label}: Props) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-7">
        {items.map((item) => (
          <li key={item.key}>
            <NavLink
              className="relative inline-flex min-h-11 items-center text-ui-sm no-underline transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-alva-green after:transition-transform after:duration-150 hover:text-alva-green hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
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
