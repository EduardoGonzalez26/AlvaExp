import {Fragment} from "react";

/**
 * Splits a heading into its lead and the closing phrase that gets the italic
 * emphasis used across the brand decks ("Why most U.S. entries *stall.*").
 *
 * The text is never altered: lead + tail always equal the original string.
 *  - With a colon or several sentences, the last clause is emphasized.
 *  - Otherwise the last third of the words is (at least one, at most three).
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

/** Renders a heading with its closing phrase in italics. Same visible text. */
export function Emphasis({text}: Props) {
  const {lead, tail} = splitEmphasis(text);

  if (!tail) {
    return <>{text}</>;
  }

  return (
    <Fragment>
      {lead}
      <em>{tail}</em>
    </Fragment>
  );
}
