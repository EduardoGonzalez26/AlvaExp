import type {Locale} from "@/content/types";

/**
 * English terms that stay in English inside Spanish copy. They are wrapped in
 * `lang="en"` so screen readers switch pronunciation (WCAG 3.1.2). The visible
 * text is unchanged; on the English site this component renders plain text.
 */
const ENGLISH_TERMS = [
  "Validate · Build · Scale",
  "Direct to Consumer Manager",
  "Business Expansion Partner",
  "General Manager",
  "Executive MBA",
  "venture capital",
  "startup",
  "retail"
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const TERM_PATTERN = new RegExp(
  `(${ENGLISH_TERMS.map(escapeRegExp).join("|")})`,
  "g"
);

type Props = {
  locale: Locale;
  text: string;
};

export function LocalizedText({locale, text}: Props) {
  if (locale === "en") {
    return <>{text}</>;
  }

  const parts = text.split(TERM_PATTERN);

  return (
    <>
      {parts.map((part, index) =>
        ENGLISH_TERMS.includes(part as (typeof ENGLISH_TERMS)[number]) ? (
          <span key={`${part}-${index}`} lang="en">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
