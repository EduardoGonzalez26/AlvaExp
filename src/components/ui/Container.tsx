import type {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/cn";

/** Page width and responsive gutters. Every section's content lives in one. */
export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-page px-gutter", className)}
      {...props}
    />
  );
}
