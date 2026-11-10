import type {ReactNode} from "react";
import type {Locale} from "@/content/types";

/**
 * Method names such as "Validate" or "Initial Fit" stay in English on the
 * Spanish site. Tagging them `lang="en"` lets screen readers pronounce them
 * correctly (WCAG 3.1.2). On the English site it renders its children as is.
 */
export function EnglishTerm({
  locale,
  children
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return locale === "en" ? <>{children}</> : <span lang="en">{children}</span>;
}
