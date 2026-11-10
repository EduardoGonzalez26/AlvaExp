import type {ReactNode} from "react";
import {cn} from "@/lib/cn";

type Props = {
  /** Left column, normally the section heading. */
  lead: ReactNode;
  /** Right column. */
  children: ReactNode;
  /**
   * "editorial": 5 + 6 columns, for statements.
   * "wide": 4 + 8 columns, for content that needs room (steps, FAQ).
   */
  ratio?: "editorial" | "wide";
  /** Keep the lead in view while the right column scrolls (desktop only). */
  stickyLead?: boolean;
  className?: string;
};

/**
 * Two-column editorial layout used by most sections. Stacks on small screens
 * with the lead first, so reading order matches the visual order everywhere.
 */
export function SplitLayout({
  lead,
  children,
  ratio = "editorial",
  stickyLead = false,
  className
}: Props) {
  const editorial = ratio === "editorial";

  return (
    <div className={cn("grid gap-10 lg:grid-cols-12 lg:gap-x-8", className)}>
      <div
        className={cn(
          "min-w-0",
          editorial ? "lg:col-span-5" : "lg:col-span-4",
          stickyLead && "lg:sticky lg:top-8 lg:self-start"
        )}
      >
        {lead}
      </div>
      <div
        className={cn(
          "min-w-0",
          editorial ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8 lg:col-start-5"
        )}
      >
        {children}
      </div>
    </div>
  );
}
