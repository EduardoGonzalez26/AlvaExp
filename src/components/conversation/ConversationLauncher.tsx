"use client";

import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import type {ContactFormContent, Locale} from "@/content/types";
import type {CountryOption} from "@/lib/countries";
import {preloadTurnstile} from "@/components/contact/TurnstileWidget";

// The dialog (and Turnstile) only load the first time someone opens it.
const ConversationDialog = dynamic(
  () => import("./ConversationDialog").then((module) => module.ConversationDialog),
  {ssr: false}
);

type Props = {
  content: ContactFormContent;
  locale: Locale;
  countryOptions: CountryOption[];
  turnstileSiteKey: string | null;
  /** Localized pathnames of Start a Conversation, in every language. */
  paths: string[];
};

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/**
 * Turns every link to Start a Conversation into a conversational dialog:
 * a plain click opens it instead of navigating. The links keep their href,
 * so without JavaScript, or with a modified click (new tab), they still lead
 * to the page, which stays available.
 *
 * The click is caught on document in the capture phase, before Next's <Link>
 * and the route loader see it.
 */
export function ConversationLauncher({paths, ...props}: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const targets = new Set(paths.map(normalize));

    function onClick(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor?.href || (anchor.target && anchor.target !== "_self")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !targets.has(normalize(url.pathname))) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setMounted(true);
      setOpen(true);
      // The verification usually solves while the questions are answered.
      preloadTurnstile();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [paths]);

  return mounted ? (
    <ConversationDialog {...props} onClose={() => setOpen(false)} open={open} />
  ) : null;
}
