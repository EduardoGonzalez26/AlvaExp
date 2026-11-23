import type {NavItem} from "@/lib/nav";
import {BoldOnHover} from "@/components/ui/BoldOnHover";
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
              className="group/bold relative inline-flex min-h-11 items-center rounded-full px-4 text-ui-sm no-underline transition-colors duration-200 ease-(--ease-brand) after:absolute after:inset-x-4 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-alva-green after:transition-transform after:duration-300 hover:text-alva-green hover:after:scale-x-100 focus-visible:text-alva-green focus-visible:after:scale-x-100 aria-[current=page]:text-alva-green aria-[current=page]:after:scale-x-100"
              href={item.href}
            >
              <BoldOnHover>{item.label}</BoldOnHover>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
