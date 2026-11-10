import {cn} from "@/lib/cn";

type Props = {
  paragraphs: string[];
  /** Render the first paragraph larger, as an introduction. */
  leadFirst?: boolean;
  className?: string;
};

/** A stack of body paragraphs with the site's reading measure and rhythm. */
export function Prose({paragraphs, leadFirst = false, className}: Props) {
  return (
    <div className={cn("grid gap-5", className)}>
      {paragraphs.map((paragraph, index) => (
        <p
          className={
            leadFirst && index === 0
              ? "text-lead text-pretty"
              : "text-body text-pretty"
          }
          key={paragraph}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
