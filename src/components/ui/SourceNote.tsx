import type {ReactNode} from "react";
import {cn} from "@/lib/cn";

type Props = {
  /** The brief's published source note, verbatim. */
  children: ReactNode;
  /** "dark" is for blue sections. */
  tone?: "light" | "dark";
  className?: string;
};

/** Visible source note shown with each data module. */
export function SourceNote({children, tone = "light", className}: Props) {
  return (
    <p
      className={cn(
        "text-caption",
        tone === "dark" ? "text-alva-paper" : "text-alva-blue",
        className
      )}
    >
      {children}
    </p>
  );
}
