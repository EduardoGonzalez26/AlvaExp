"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode
} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import type {ContactFormContent, Locale} from "@/content/types";
import type {CountryOption} from "@/lib/countries";
import {
  CONTACT_ERROR_ORDER,
  createEmptyContactForm,
  DESCRIPTION_MAX_LENGTH,
  isContactFieldVisible,
  validateContactForm,
  type ContactFieldError,
  type ContactFormErrors,
  type ContactFormValues
} from "@/lib/contact/form";
import {submitContact} from "@/lib/contact/submit";
import {cn} from "@/lib/cn";
import {BrandLogo} from "@/components/layout/BrandLogo";
import {ArrowIcon} from "@/components/ui/ArrowIcon";
import {buttonClasses} from "@/components/ui/ButtonLink";
import {TurnstileWidget} from "@/components/contact/TurnstileWidget";

type Props = {
  content: ContactFormContent;
  locale: Locale;
  countryOptions: CountryOption[];
  turnstileSiteKey: string | null;
  open: boolean;
  onClose: () => void;
};

type QuestionId =
  | "inquiryType"
  | "fullName"
  | "email"
  | "company"
  | "role"
  | "website"
  | "country"
  | "stage"
  | "markets"
  | "description"
  | "referralSource";

type StepId = "intro" | QuestionId | "review" | "done";

/** Conversation order. Conditional questions only appear when they apply. */
const QUESTION_ORDER: QuestionId[] = [
  "inquiryType",
  "fullName",
  "email",
  "company",
  "role",
  "website",
  "country",
  "stage",
  "markets",
  "description",
  "referralSource"
];

const REQUIRED = new Set<QuestionId>(["inquiryType", "fullName", "email", "description"]);
const CONDITIONAL = new Set<QuestionId>(["role", "website", "country", "stage"]);
const LETTERS = "ABCDEFGH";

const inputClass =
  "mt-6 block w-full border-0 border-b-2 border-alva-stone bg-transparent px-0 py-3 font-serif text-[clamp(1.5rem,3vw,2rem)] text-alva-blue placeholder:text-alva-blue/35 transition-colors duration-200 focus:border-alva-green focus:outline-none focus-visible:outline-none aria-invalid:border-alva-blue";

/**
 * Conversational contact dialog: one question per screen, answered and then
 * on to the next, inside a native modal <dialog> (focus is trapped, Escape
 * closes, the page behind is inert). It reuses the page form's rules
 * (validation, conditional fields, payload and API), so both send exactly the
 * same message. Answers survive closing the dialog until a message is sent.
 */
export function ConversationDialog({
  content,
  locale,
  countryOptions,
  turnstileSiteKey,
  open,
  onClose
}: Props) {
  const t = useTranslations("ContactForm");
  const c = useTranslations("ContactForm.conversation");
  const fields = content.fields;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<ContactFormValues>(createEmptyContactForm);
  const [step, setStep] = useState<StepId>("intro");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState(false);
  const [token, setToken] = useState("");
  const [pendingSend, setPendingSend] = useState(false);
  const sendingRef = useRef(false);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const questions = useMemo(
    () =>
      QUESTION_ORDER.filter(
        (id) => !CONDITIONAL.has(id) || isContactFieldVisible(id, values.inquiryType)
      ),
    [values.inquiryType]
  );
  const flow: StepId[] = useMemo(() => [...questions, "review"], [questions]);
  const position = flow.indexOf(step);

  // Open and close the native modal with the parent's state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.toggleAttribute("data-dialog-open", open);
    window.dispatchEvent(
      new CustomEvent("alva:dialog", {detail: {open}})
    );

    return () => {
      document.documentElement.removeAttribute("data-dialog-open");
      window.dispatchEvent(new CustomEvent("alva:dialog", {detail: {open: false}}));
    };
  }, [open]);

  // Each new screen takes focus on its main control (or its heading).
  useEffect(() => {
    if (!open) return;
    const root = bodyRef.current;
    const target =
      root?.querySelector<HTMLElement>("[data-autofocus]") ??
      root?.querySelector<HTMLElement>("h2");
    target?.focus({preventScroll: true});
  }, [step, open]);

  function errorText(error: ContactFieldError) {
    return error.max === undefined
      ? t(`errors.${error.key}`)
      : t(`errors.${error.key}`, {max: error.max});
  }

  function labelFor(id: QuestionId): string {
    switch (id) {
      case "inquiryType":
        return fields.inquiryType.label;
      case "markets":
        return fields.markets.label;
      case "description":
        return fields.description.label;
      case "stage":
        return fields.stage.label;
      default:
        return fields[id];
    }
  }

  function answerFor(id: QuestionId): string {
    switch (id) {
      case "inquiryType":
        return values.inquiryType ? fields.inquiryType.options[values.inquiryType] : "";
      case "stage":
        return values.stage ? fields.stage.options[values.stage] : "";
      case "country":
        return countryOptions.find((option) => option.value === values.country)?.label ?? "";
      default:
        return values[id];
    }
  }

  function update<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((previous) => ({...previous, [field]: value}));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = {...previous};
      delete next[field];
      return next;
    });
  }

  function go(next: StepId, dir: "forward" | "back" = "forward") {
    setDirection(dir);
    setStep(next);
    bodyRef.current?.scrollTo({top: 0});
  }

  function nextStep(event?: FormEvent) {
    event?.preventDefault();

    if (step === "intro") return go(flow[0]!);
    if (step === "review" || step === "done") return;

    const error = validateContactForm(values)[step];
    if (error) {
      setErrors((previous) => ({...previous, [step]: error}));
      return;
    }

    go(flow[position + 1] ?? "review");
  }

  function previousStep() {
    if (position <= 0) return go("intro", "back");
    go(flow[position - 1]!, "back");
  }

  function choose(field: "inquiryType" | "stage", value: string) {
    setValues((previous) => ({...previous, [field]: value}));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = {...previous};
      delete next[field];
      return next;
    });
    // The choice is kept on screen; the confirm button moves on.
  }

  async function deliver(currentToken: string) {
    if (submitting || sendingRef.current) return;

    setFailure(false);
    const found = validateContactForm(values);

    if (!turnstileSiteKey) {
      found.turnstile = {key: "verificationUnavailable"};
      setErrors(found);
      return;
    }

    if (!currentToken) {
      // The challenge may still be solving: wait for the token and continue.
      found.turnstile = {key: "verificationRequired"};
      setErrors(found);
      setPendingSend(true);
      const box = document.getElementById("conv-turnstile");
      box?.scrollIntoView({block: "center"});
      box?.focus({preventScroll: true});
      return;
    }

    const firstQuestion = CONTACT_ERROR_ORDER.find(
      (field): field is QuestionId => Boolean(found[field]) && questions.includes(field as QuestionId)
    );

    if (firstQuestion) {
      setErrors(found);
      return go(firstQuestion, "back");
    }

    if (found.privacyAccepted) {
      setErrors(found);
      return;
    }

    setPendingSend(false);
    sendingRef.current = true;
    setSubmitting(true);
    const result = await submitContact(values, locale === "es" ? "es" : "en", currentToken);
    sendingRef.current = false;
    setSubmitting(false);
    setToken("");
    setTurnstileReset((value) => value + 1);

    if (result.ok) {
      setErrors({});
      return go("done");
    }

    setErrors(result.fieldErrors);
    setFailure(true);
    const serverQuestion = CONTACT_ERROR_ORDER.find(
      (field): field is QuestionId =>
        Boolean(result.fieldErrors[field]) && questions.includes(field as QuestionId)
    );
    if (serverQuestion) go(serverQuestion, "back");
  }

  function send(event: FormEvent) {
    event.preventDefault();
    void deliver(token);
  }

  function close() {
    onClose();
    // After a sent message, the next conversation starts fresh.
    if (step === "done") {
      setValues(createEmptyContactForm());
      setStep("intro");
      setFailure(false);
    }
  }

  function textareaKeys(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const question = step !== "intro" && step !== "review" && step !== "done" ? step : null;
  const error: ContactFieldError | undefined = question ? errors[question] : undefined;
  const errorId = question ? `conv-${question}-error` : undefined;
  const total = flow.length;

  function Choices({
    field,
    options,
    value
  }: {
    field: "inquiryType" | "stage";
    options: [string, string][];
    value: string;
  }) {
    return (
      <div
        className="mt-6 grid gap-3"
        onKeyDown={(event) => {
          const index = LETTERS.indexOf(event.key.toUpperCase());
          if (index >= 0 && options[index]) {
            event.preventDefault();
            choose(field, options[index][0]);
          }
        }}
      >
        {options.map(([key, label], index) => (
          <label
            className={cn(
              "group/choice flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-ui transition-colors duration-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-alva-blue",
              value === key
                ? "border-alva-green bg-alva-green text-alva-paper"
                : "border-alva-stone hover:border-alva-green hover:text-alva-green"
            )}
            key={key}
          >
            <input
              aria-describedby={error ? errorId : undefined}
              checked={value === key}
              className="sr-only"
              data-autofocus={(value ? value === key : index === 0) || undefined}
              name={field}
              onChange={() => choose(field, key)}
              type="radio"
              value={key}
            />
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-caption",
                value === key ? "border-alva-paper" : "border-current"
              )}
            >
              {LETTERS[index]}
            </span>
            <span>{label}</span>
          </label>
        ))}
      </div>
    );
  }

  function renderQuestion(id: QuestionId): ReactNode {
    const hint = hintFor(id);
    const describedBy = [error ? errorId : null, hint ? `conv-${id}-hint` : null]
      .filter(Boolean)
      .join(" ");

    const common = {
      "aria-describedby": describedBy || undefined,
      "aria-invalid": Boolean(error) || undefined,
      "data-autofocus": true,
      id: `conv-${id}`
    };

    switch (id) {
      case "inquiryType":
        return (
          <Choices
            field="inquiryType"
            options={Object.entries(fields.inquiryType.options)}
            value={values.inquiryType}
          />
        );
      case "stage":
        return (
          <Choices
            field="stage"
            options={Object.entries(fields.stage.options)}
            value={values.stage}
          />
        );
      case "country":
        return (
          <select
            {...common}
            className={cn(inputClass, "cursor-pointer text-[clamp(1.25rem,2.4vw,1.5rem)]")}
            data-lenis-prevent
            onChange={(event) => update("country", event.target.value)}
            value={values.country}
          >
            <option value="">{t("countryPlaceholder")}</option>
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "description":
        return (
          <>
            <textarea
              {...common}
              className={cn(inputClass, "min-h-40 resize-y text-[clamp(1.125rem,2vw,1.375rem)] leading-relaxed")}
              data-lenis-prevent
              maxLength={DESCRIPTION_MAX_LENGTH}
              onChange={(event) => update("description", event.target.value)}
              onKeyDown={textareaKeys}
              placeholder={c("placeholder")}
              rows={5}
              value={values.description}
            />
            <p className="mt-2 text-right font-mono text-caption" id="conv-description-count">
              {t("charCount", {count: values.description.length, max: DESCRIPTION_MAX_LENGTH})}
            </p>
          </>
        );
      default: {
        const input = {
          fullName: {autoComplete: "name", type: "text"},
          email: {autoComplete: "email", type: "email", inputMode: "email" as const},
          company: {autoComplete: "organization", type: "text"},
          role: {autoComplete: "organization-title", type: "text"},
          website: {autoComplete: "url", type: "url", inputMode: "url" as const},
          markets: {autoComplete: "off", type: "text"},
          referralSource: {autoComplete: "off", type: "text"}
        }[id];

        return (
          <input
            {...common}
            {...input}
            className={inputClass}
            onChange={(event) => update(id, event.target.value)}
            placeholder={c("placeholder")}
            value={values[id]}
          />
        );
      }
    }
  }

  function hintFor(id: QuestionId): string | null {
    if (id === "markets") return fields.markets.hint;
    if (id === "description" && values.inquiryType) {
      return fields.description.hints[values.inquiryType];
    }
    return null;
  }

  const answered = flow.filter((id): id is QuestionId => id !== "review");

  return (
    <dialog
      aria-label={c("dialogLabel")}
      className="conv-dialog"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        // A click on the backdrop (outside the panel) closes the dialog.
        if (event.target === event.currentTarget) close();
      }}
      ref={dialogRef}
    >
      <div className="flex flex-col max-sm:h-full">
        {/* Top bar: logo, step, progress and close. */}
        <div className="relative flex items-center justify-between gap-4 border-b border-alva-stone px-6 py-4 sm:px-8">
          <BrandLogo />
          <div className="flex items-center gap-4">
            {position >= 0 && step !== "done" ? (
              <span className="font-mono text-caption" aria-live="polite">
                {step === "intro" || question === "inquiryType" || !values.inquiryType
                  ? c("stepOnly", {current: position + 1})
                  : c("step", {current: position + 1, total})}
              </span>
            ) : null}
            <button
              aria-label={c("close")}
              className="inline-flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-alva-green hover:text-alva-paper"
              onClick={close}
              type="button"
            >
              <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-alva-stone/40">
            <span
              className="block h-full bg-brand-gradient-x transition-[width] duration-500 ease-(--ease-brand)"
              style={{
                width: `${step === "done" ? 100 : position < 0 ? 0 : ((position + 1) / total) * 100}%`
              }}
            />
          </span>
        </div>

        <div className="conv-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain" ref={bodyRef}>
          <div
            className="conv-step px-6 py-10 sm:px-12 sm:py-14"
            data-dir={direction}
            key={step}
          >
            {step === "intro" ? (
              <form noValidate onSubmit={nextStep}>
                <h2 className="text-display-2 text-balance" tabIndex={-1}>
                  {content.heading}
                </h2>
                <p className="mt-6 max-w-[44ch] text-lead text-pretty">{content.introduction}</p>
                <button className={buttonClasses("primary", "default", "mt-10 rounded-full!", true)} data-autofocus type="submit">
                  <span>{c("start")}</span>
                  <ArrowIcon />
                </button>
              </form>
            ) : null}

            {question ? (
              <form noValidate onSubmit={nextStep}>
                <p className="flex items-center gap-3 font-mono text-eyebrow text-alva-green">
                  <span>{String(position + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-current" />
                  {!REQUIRED.has(question) ? <span>{c("optional")}</span> : null}
                </p>
                {question === "inquiryType" || question === "stage" ? (
                  <fieldset aria-describedby={error ? errorId : undefined}>
                    <legend className="mt-4">
                      <h2 className="font-serif text-title text-balance" tabIndex={-1}>
                        {labelFor(question)}
                      </h2>
                    </legend>
                    {renderQuestion(question)}
                  </fieldset>
                ) : (
                  <>
                    <h2 className="mt-4 font-serif text-title text-balance">
                      <label htmlFor={`conv-${question}`}>{labelFor(question)}</label>
                    </h2>
                    {hintFor(question) ? (
                      <p className="mt-3 max-w-[52ch] text-body text-pretty" id={`conv-${question}-hint`}>
                        {hintFor(question)}
                      </p>
                    ) : null}
                    {renderQuestion(question)}
                  </>
                )}

                {error ? (
                  <p className="mt-4 flex items-center gap-2 text-ui-sm font-medium" id={errorId} role="alert">
                    <span aria-hidden="true" className="size-1.5 rotate-45 bg-alva-blue" />
                    {errorText(error)}
                  </p>
                ) : null}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <button className={buttonClasses("primary", "default", "rounded-full!", true)} type="submit">
                    <span>
                      {!REQUIRED.has(question) && answerFor(question).trim() === ""
                        ? c("skip")
                        : c("next")}
                    </span>
                    <ArrowIcon />
                  </button>
                  <button
                    className="inline-flex min-h-12 items-center rounded-full px-5 text-ui transition-colors duration-200 hover:text-alva-green"
                    onClick={previousStep}
                    type="button"
                  >
                    {c("back")}
                  </button>
                  <span className="hidden font-mono text-caption sm:inline">{c("enterHint")}</span>
                </div>
              </form>
            ) : null}

            {step === "review" ? (
              <form aria-busy={submitting} noValidate onSubmit={send}>
                <p className="font-mono text-eyebrow text-alva-green">
                  {String(position + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-serif text-title" tabIndex={-1}>
                  {c("reviewTitle")}
                </h2>

                {failure ? (
                  <p className="mt-6 rounded-xl border-l-4 border-alva-blue bg-alva-mist p-4 text-ui-sm" role="alert">
                    {content.error}
                  </p>
                ) : null}

                <dl className="mt-6 divide-y divide-alva-stone border-y border-alva-stone">
                  {answered.map((id) => (
                    <div className="flex items-start gap-4 py-3" key={id}>
                      <div className="min-w-0 flex-1">
                        <dt className="font-mono text-caption">{labelFor(id)}</dt>
                        <dd className="mt-1 text-ui break-words whitespace-pre-line">
                          {answerFor(id).trim() || <span className="text-alva-blue/60">{c("empty")}</span>}
                        </dd>
                      </div>
                      <button
                        className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-ui-sm underline decoration-1 underline-offset-4 hover:text-alva-green"
                        onClick={() => go(id, "back")}
                        type="button"
                      >
                        <span aria-hidden="true">{c("edit")}</span>
                        <span className="sr-only">{c("edit")}: {labelFor(id)}</span>
                      </button>
                    </div>
                  ))}
                </dl>

                <label className="mt-6 flex cursor-pointer items-start gap-3" htmlFor="conv-privacy">
                  <input
                    aria-describedby={errors.privacyAccepted ? "conv-privacy-error" : undefined}
                    aria-invalid={Boolean(errors.privacyAccepted) || undefined}
                    checked={values.privacyAccepted}
                    className="mt-0.5 size-6 shrink-0 cursor-pointer accent-alva-green"
                    data-autofocus
                    id="conv-privacy"
                    onChange={(event) => update("privacyAccepted", event.target.checked)}
                    type="checkbox"
                  />
                  <span className="text-body">
                    {content.privacyAcknowledgement.before}
                    <Link
                      className="underline decoration-1 underline-offset-4 hover:text-alva-green"
                      href="/privacy-notice"
                      rel="noopener"
                      target="_blank"
                    >
                      {content.privacyAcknowledgement.linkLabel}
                    </Link>
                    {content.privacyAcknowledgement.after}
                    <span aria-hidden="true"> *</span>
                    <span className="sr-only"> {t("required")}</span>
                  </span>
                </label>
                {errors.privacyAccepted ? (
                  <p className="mt-2 pl-9 text-ui-sm font-medium" id="conv-privacy-error" role="alert">
                    {errorText(errors.privacyAccepted)}
                  </p>
                ) : null}

                <div className="mt-6">
                  <TurnstileWidget
                    describedBy={errors.turnstile ? "conv-turnstile-error" : undefined}
                    id="conv-turnstile"
                    invalid={Boolean(errors.turnstile)}
                    locale={locale}
                    onTokenChange={(value) => {
                      setToken(value);
                      if (value) {
                        setErrors((previous) => {
                          const next = {...previous};
                          if (!next.turnstile) return previous;
                          delete next.turnstile;
                          return next;
                        });
                        // A send was waiting for the challenge: continue it.
                        if (pendingSend && values.privacyAccepted) {
                          setPendingSend(false);
                          void deliver(value);
                        }
                      }
                    }}
                    resetSignal={turnstileReset}
                    siteKey={turnstileSiteKey}
                  />
                  {errors.turnstile ? (
                    <p className="mt-2 text-ui-sm font-medium" id="conv-turnstile-error" role="alert">
                      {errorText(errors.turnstile)}
                    </p>
                  ) : null}
                  {pendingSend && !token ? (
                    <p className="mt-2 font-mono text-caption" role="status">
                      {c("waiting")}
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    aria-disabled={submitting || undefined}
                    className={buttonClasses(
                      "primary",
                      "default",
                      "rounded-full! aria-disabled:cursor-progress aria-disabled:border-alva-stone aria-disabled:bg-alva-stone aria-disabled:text-alva-blue",
                      true
                    )}
                    type="submit"
                  >
                    <span>{submitting ? t("sending") : content.submit}</span>
                    {submitting ? (
                      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
                    ) : (
                      <ArrowIcon />
                    )}
                  </button>
                  <button
                    className="inline-flex min-h-12 items-center rounded-full px-5 text-ui transition-colors duration-200 hover:text-alva-green"
                    onClick={previousStep}
                    type="button"
                  >
                    {c("back")}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "done" ? (
              <div className="py-6 text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-gradient text-alva-paper"
                >
                  <svg className="size-7" fill="none" viewBox="0 0 14 14">
                    <path d="m2.5 7.5 3 3 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                  </svg>
                </span>
                <h2 className="mx-auto mt-8 max-w-[28ch] font-serif text-title text-balance" role="status" tabIndex={-1}>
                  {content.success}
                </h2>
                <button className={buttonClasses("primary", "default", "mx-auto mt-10 rounded-full!", true)} data-autofocus onClick={close} type="button">
                  <span>{c("close")}</span>
                  <ArrowIcon />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  );
}
