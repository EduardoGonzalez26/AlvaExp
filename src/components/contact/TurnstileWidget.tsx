"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import type {Locale} from "@/content/types";
import {cn} from "@/lib/cn";

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  language?: string;
  size?: "normal" | "compact" | "flexible";
  appearance?: "always" | "execute" | "interaction-only";
  retry?: "auto" | "never";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "timeout-callback"?: () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Never leave the form waiting forever if the widget script is blocked. */
const LOAD_TIMEOUT_MS = 10_000;

type Status = "loading" | "ready" | "error" | "unavailable";

type Props = {
  /** `null` in production when NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing. */
  siteKey: string | null;
  locale: Locale;
  onTokenChange: (token: string) => void;
  /** Increment to discard the used token and render a fresh challenge. */
  resetSignal: number;
  /** Id of the inline error paragraph shown by the form, when present. */
  describedBy?: string;
  invalid?: boolean;
};

/**
 * Cloudflare Turnstile widget (explicit render).
 *
 * The widget's iframe is injected in normal document order, after the fields
 * and before the submit button, so Tab reaches it without a focus trap. The
 * wrapper is a labelled group; Cloudflare provides the keyboard-operable
 * challenge inside it.
 *
 * Development uses Cloudflare's test site key when the environment variable is
 * unset. Production without a key shows a controlled error and the form never
 * sends a request.
 */
export function TurnstileWidget({
  siteKey,
  locale,
  onTokenChange,
  resetSignal,
  describedBy,
  invalid = false
}: Props) {
  const t = useTranslations("ContactForm");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [status, setStatus] = useState<Status>(
    siteKey ? "loading" : "unavailable"
  );

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    const activeSiteKey = siteKey;
    let cancelled = false;

    const loadTimeout = window.setTimeout(() => {
      if (!cancelled && !widgetIdRef.current) {
        setStatus("error");
        onTokenChangeRef.current("");
      }
    }, LOAD_TIMEOUT_MS);

    function renderWidget(): void {
      if (cancelled || !window.turnstile || !containerRef.current) {
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: activeSiteKey,
          theme: "light",
          language: locale,
          size: "flexible",
          appearance: "always",
          retry: "auto",
          callback: (token) => {
            if (!cancelled) {
              setStatus("ready");
              onTokenChangeRef.current(token);
            }
          },
          "expired-callback": () => {
            if (!cancelled) {
              onTokenChangeRef.current("");
            }
          },
          "timeout-callback": () => {
            if (!cancelled) {
              onTokenChangeRef.current("");
            }
          },
          "error-callback": () => {
            if (!cancelled) {
              setStatus("error");
              onTokenChangeRef.current("");
            }
          }
        });
        setStatus("ready");
      } catch {
        setStatus("error");
        onTokenChangeRef.current("");
      }
    }

    function handleScriptError(): void {
      if (!cancelled) {
        setStatus("error");
        onTokenChangeRef.current("");
      }
    }

    onTokenChangeRef.current("");

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );

    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
      existingScript.addEventListener("error", handleScriptError);
    } else {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget);
      script.addEventListener("error", handleScriptError);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(loadTimeout);

      const currentScript = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`
      );
      currentScript?.removeEventListener("load", renderWidget);
      currentScript?.removeEventListener("error", handleScriptError);

      const widgetId = widgetIdRef.current;
      widgetIdRef.current = null;

      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // The widget may already be gone after a full reset.
        }
      }
    };
  }, [siteKey, locale]);

  useEffect(() => {
    if (resetSignal === 0 || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    onTokenChangeRef.current("");

    try {
      window.turnstile.reset(widgetIdRef.current);
    } catch {
      // The error callback reports the failure; the next submit will ask for
      // a fresh verification instead of sending a stale token.
    }
  }, [resetSignal]);

  const effectiveStatus: Status = siteKey
    ? status === "unavailable"
      ? "loading"
      : status
    : "unavailable";
  const messageId = "contact-turnstile-message";
  const showMessage =
    effectiveStatus === "unavailable" || effectiveStatus === "error";

  return (
    <div
      aria-describedby={cn(showMessage && messageId, describedBy) || undefined}
      aria-labelledby="contact-turnstile-label"
      className={cn(
        "rounded-lg border p-4",
        invalid
          ? "border-alva-blue bg-alva-mist ring-2 ring-alva-blue"
          : "border-alva-blue bg-alva-paper"
      )}
      id="contact-turnstile"
      role="group"
      tabIndex={-1}
    >
      <p
        className="mb-3 font-mono text-eyebrow uppercase"
        id="contact-turnstile-label"
      >
        {t("verificationLabel")}
      </p>

      <div className="min-h-[4.0625rem] w-full" ref={containerRef} />

      {effectiveStatus === "loading" ? (
        <p className="mt-2 text-caption">{t("verificationLoading")}</p>
      ) : null}

      {effectiveStatus === "unavailable" ? (
        <p className="text-ui-sm font-medium text-alva-blue" id={messageId} role="alert">
          {t("verificationUnavailable")}
        </p>
      ) : null}

      {effectiveStatus === "error" ? (
        <p className="text-ui-sm font-medium text-alva-blue" id={messageId} role="alert">
          {t("verificationLoadError")}
        </p>
      ) : null}
    </div>
  );
}
