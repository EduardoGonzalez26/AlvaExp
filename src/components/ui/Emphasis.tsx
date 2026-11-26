import {Fragment, type ReactNode} from "react";

/** Marks a line break that only applies from the desktop breakpoint. */
const BREAK = "\n";

/**
 * Splits a heading into its lead and the closing phrase that gets the italic
 * emphasis used across the brand decks ("Why most U.S. entries *stall.*").
 *
 * The text is never altered: lead + tail always equal the original string.
 *  - With a colon or several sentences, the last clause is emphasized.
 *  - Otherwise the last third of the words is (at least one, at most three).
 *
 * A "\n" in the text is an explicit line break on desktop; on small screens
 * it renders as a normal space and the text wraps on its own.
 */
export function splitEmphasis(text: string): {lead: string; tail: string} {
  const colon = text.lastIndexOf(": ");
  const sentence = (() => {
    for (let index = text.length - 2; index > 0; index -= 1) {
      if (text[index] === " " && /[.!?]/.test(text[index - 1] ?? "")) {
        return index;
      }
    }
    return -1;
  })();

  const cut = Math.max(colon === -1 ? -1 : colon + 1, sentence);

  if (cut > 0) {
    return {lead: text.slice(0, cut + 1), tail: text.slice(cut + 1)};
  }

  const words = text.split(" ");

  if (words.length < 2) {
    return {lead: text, tail: ""};
  }

  const count = Math.min(3, Math.max(1, Math.ceil(words.length / 3)));
  const lead = `${words.slice(0, words.length - count).join(" ")} `;

  return {lead, tail: words.slice(words.length - count).join(" ")};
}

type Props = {
  text: string;
};

/** Marks a word rendered in the brand sage; the markers are not printed. */
const HIGHLIGHT = /(\*[^*\n]+\*)/g;

/** Renders highlighted words inside a line, keeping the rest as plain text. */
function withHighlights(value: string, keyPrefix: string): ReactNode {
  const parts = value.split(HIGHLIGHT);

  if (parts.length === 1) {
    return value;
  }

  return parts.map((part, index) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <span className="text-alva-sage" key={`${keyPrefix}-h${index}`}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <Fragment key={`${keyPrefix}-t${index}`}>{part}</Fragment>
    )
  );
}

/** Replaces explicit breaks with desktop-only <br> elements. */
function withBreaks(value: string, keyPrefix: string): ReactNode {
  return value.split(BREAK).map((part, index) => (
    <Fragment key={`${keyPrefix}-${index}`}>
      {index > 0 && (
        <>
          <br className="hidden lg:inline" />
          {" "}
        </>
      )}
      {withHighlights(part, `${keyPrefix}-${index}`)}
    </Fragment>
  ));
}

/** Renders a heading with its closing phrase in italics. Same visible text. */
export function Emphasis({text}: Props) {
  // Breaks become spaces only to find the cut: lengths (and indices) match, so
  // the original string can be sliced at the same points and keep its "\n".
  const {lead, tail} = splitEmphasis(text.split(BREAK).join(" "));
  const leadText = text.slice(0, lead.length);
  const tailText = text.slice(lead.length);

  return (
    <Fragment>
      {withBreaks(leadText, "lead")}
      {tail ? <em>{withBreaks(tailText, "tail")}</em> : null}
    </Fragment>
  );
}
