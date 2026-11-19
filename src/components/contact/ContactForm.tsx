"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import type {BusinessStage, InquiryType} from "@/lib/contact/types";
import type {ContactFormContent, Locale} from "@/content/types";
import type {CountryOption} from "@/lib/countries";
import {
  buildContactPayload,
  CONTACT_ERROR_ORDER,
  createEmptyContactForm,
  DESCRIPTION_MAX_LENGTH,
  FIELD_MAX_LENGTH,
  filterVisibleErrors,
  hasContactFormErrors,
  isContactFieldVisible,
  mapServerFieldErrors,
  validateContactForm,
  type ContactErrorTarget,
  type ContactFieldError,
  type ContactFormErrors
} from "@/lib/contact/form";
import {cn} from "@/lib/cn";
import {ArrowIcon} from "@/components/ui/ArrowIcon";
import {TurnstileWidget} from "./TurnstileWidget";

type Props = {
  content: ContactFormContent;
  locale: Locale;
  countryOptions: CountryOption[];
  turnstileSiteKey: string | null;
};

type FocusTarget = "summary" | "alert" | "success";

const FIELD_IDS: Record<ContactErrorTarget, string> = {
  inquiryType: "contact-inquiry-type",
  fullName: "contact-full-name",
  email: "contact-email",
  company: "contact-company",
  markets: "contact-markets",
  description: "contact-description",
  privacyAccepted: "contact-privacy-accepted",
  website: "contact-website",
  role: "contact-role",
  country: "contact-country",
  stage: "contact-stage",
  referralSource: "contact-referral-source",
  turnstile: "contact-turnstile"
};

/*
 * Border contrast (WCAG 2.1 AA, 1.4.11): #0A3161 on #F4F2EE is 11.56:1, well
 * above the 3:1 minimum for component boundaries. Hover uses the green
 * (#006847 on #F4F2EE = 6.12:1). Errors are not conveyed by colour alone: the
 * field also gets aria-invalid, a ring, an icon and a text message.
 */
const CONTROL_CLASS =
  "mt-2 block w-full min-h-12 rounded-lg border bg-alva-paper px-3.5 py-2.5 text-body text-alva-blue transition-colors duration-150 hover:border-alva-green";
const CONTROL_VALID_CLASS = "border-alva-blue";
const CONTROL_INVALID_CLASS = "border-alva-blue ring-1 ring-alva-blue";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFieldErrors(value: unknown): Record<string, string> | null {
  if (!isRecord(value) || !isRecord(value.fieldErrors)) {
    return null;
  }

  const fieldErrors: Record<string, string> = {};
  for (const [field, message] of Object.entries(value.fieldErrors)) {
    if (typeof message === "string") {
      fieldErrors[field] = message;
    }
  }

  return fieldErrors;
}

function FieldError({error, id}: {error: ContactFieldError; id: string}) {
  const t = useTranslations("ContactForm");

  const message =
    error.max === undefined
      ? t(`errors.${error.key}`)
      : t(`errors.${error.key}`, {max: error.max});

  return (
    <p
      className="mt-2 flex items-start gap-2 text-ui-sm font-medium text-alva-blue"
      id={id}
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0"
        fill="none"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 4.75v4M8 11.1v.15"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
}

type FieldProps = {
  name: ContactErrorTarget;
  label: string;
  required?: boolean;
  error?: ContactFieldError;
  hint?: string;
  extraDescribedBy?: string;
  className?: string;
  children: (aria: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
};

function Field({
  name,
  label,
  required = false,
  error,
  hint,
  extraDescribedBy,
  className,
  children
}: FieldProps) {
  const t = useTranslations("ContactForm");
  const id = FIELD_IDS[name];
  const errorId = `${id}-error`;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy =
    [hintId, extraDescribedBy, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={className}>
      <label className="block text-ui" htmlFor={id}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1">
              *
            </span>
            <span className="sr-only"> {t("required")}</span>
          </>
        ) : null}
      </label>

      {children({id, describedBy, invalid: Boolean(error)})}

      {hint ? (
        <p className="mt-2 text-caption" id={hintId}>
          {hint}
        </p>
      ) : null}

      {error ? <FieldError error={error} id={errorId} /> : null}
    </div>
  );
}

/**
 * Contact form.
 *
 * State is intentionally local: values survive any API failure, hidden
 * conditional values are kept while the type changes but never sent, and the
 * form is cleared only after a confirmed 200 {ok: true}.
 */
export function ContactForm({
  content,
  locale,
  countryOptions,
  turnstileSiteKey
}: Props) {
  const t = useTranslations("ContactForm");
  const currentLocale = useLocale();
  const fields = content.fields;

  const [values, setValues] = useState(createEmptyContactForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailure, setSubmitFailure] = useState(false);
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);

  const summaryRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<FocusTarget | null>(null);

  const errorEntries = CONTACT_ERROR_ORDER.flatMap((field) => {
    const error = errors[field];
    return error ? [{field, error}] : [];
  });
  const hasErrors = errorEntries.length > 0;
  const descriptionLength = values.description.length;
  const remainingCharacters = DESCRIPTION_MAX_LENGTH - descriptionLength;

  // Only threshold changes produce text, so the live region stays quiet while
  // the user types. The visible counter is associated with the textarea
  // through aria-describedby and is read on focus.
  const characterNotice =
    remainingCharacters === 0
      ? t("characterLimitReached")
      : remainingCharacters === 100 ||
          remainingCharacters === 50 ||
          remainingCharacters === 20
        ? t("charactersRemaining", {count: remainingCharacters})
        : "";

  useEffect(() => {
    const target = pendingFocus.current;

    if (!target || isSubmitting) {
      return;
    }

    pendingFocus.current = null;

    const element =
      target === "summary"
        ? summaryRef.current
        : target === "alert"
          ? alertRef.current
          : successRef.current;

    element?.focus();
  }, [errors, submitFailure, success, isSubmitting]);

  function errorMessage(error: ContactFieldError): string {
    return error.max === undefined
      ? t(`errors.${error.key}`)
      : t(`errors.${error.key}`, {max: error.max});
  }

  function labelFor(field: ContactErrorTarget): string {
    switch (field) {
      case "inquiryType":
        return fields.inquiryType.label;
      case "fullName":
        return fields.fullName;
      case "email":
        return fields.email;
      case "company":
        return fields.company;
      case "markets":
        return fields.markets.label;
      case "description":
        return fields.description.label;
      case "privacyAccepted":
        return content.privacyAcknowledgement.linkLabel;
      case "website":
        return fields.website;
      case "role":
        return fields.role;
      case "country":
        return fields.country;
      case "stage":
        return fields.stage.label;
      case "referralSource":
        return fields.referralSource;
      case "turnstile":
        return t("verificationLabel");
    }
  }

  function focusTarget(field: ContactErrorTarget): void {
    const element = document.getElementById(FIELD_IDS[field]);
    if (!element) {
      return;
    }

    element.focus({preventScroll: true});
    element.scrollIntoView({block: "center"});
  }

  function clearFieldError(field: ContactErrorTarget): void {
    setErrors((previous) => {
      if (!previous[field]) {
        return previous;
      }

      const next = {...previous};
      delete next[field];
      return next;
    });
  }

  function updateField<K extends keyof typeof values>(
    field: K,
    value: (typeof values)[K]
  ): void {
    setValues((previous) => ({...previous, [field]: value}));
    clearFieldError(field);
  }

  function handleInquiryTypeChange(event: ChangeEvent<HTMLSelectElement>): void {
    const inquiryType = event.target.value as InquiryType | "";

    setValues((previous) => ({...previous, inquiryType}));
    setErrors((previous) => {
      const next = filterVisibleErrors(previous, inquiryType);
      if (inquiryType !== "") {
        delete next.inquiryType;
      }
      return next;
    });
  }

  function resetTurnstile(): void {
    setTurnstileToken("");
    setTurnstileReset((value) => value + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSuccess(false);
    setSubmitFailure(false);

    const nextErrors = validateContactForm(values);

    if (!turnstileSiteKey) {
      nextErrors.turnstile = {key: "verificationUnavailable"};
    } else if (!turnstileToken) {
      nextErrors.turnstile = {key: "verificationRequired"};
    }

    if (hasContactFormErrors(nextErrors)) {
      pendingFocus.current = "summary";
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * trailingSlash: true makes /api/contact/ the canonical route. Calling it
       * directly avoids a 308 redirect on every submission.
       */
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {"content-type": "application/json"},
        credentials: "same-origin",
        body: JSON.stringify(
          buildContactPayload(values, {
            locale: (currentLocale === "es" ? "es" : "en") as "en" | "es",
            turnstileToken
          })
        )
      });

      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (response.ok && isRecord(body) && body.ok === true) {
        setValues(createEmptyContactForm());
        setErrors({});
        setSuccess(true);
        setSubmitFailure(false);
        pendingFocus.current = "success";
        resetTurnstile();
        return;
      }

      const fieldErrors = readFieldErrors(body);
      const mappedErrors = fieldErrors
        ? mapServerFieldErrors(fieldErrors, values.inquiryType)
        : {};

      setErrors(mappedErrors);
      setSubmitFailure(true);
      pendingFocus.current = hasContactFormErrors(mappedErrors)
        ? "summary"
        : "alert";
      resetTurnstile();
    } catch {
      setErrors({});
      setSubmitFailure(true);
      pendingFocus.current = "alert";
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-labelledby="contact-form-heading"
      className="min-w-0"
      noValidate
      onSubmit={handleSubmit}
    >
      {hasErrors ? (
        <div
          aria-labelledby="contact-error-summary-title"
          className="mb-8 rounded-xl border-2 border-alva-blue bg-alva-paper p-5"
          ref={summaryRef}
          role="group"
          tabIndex={-1}
        >
          <h3 className="text-card-title" id="contact-error-summary-title">
            {t("errorSummaryTitle")}
          </h3>
          <p className="mt-2 text-ui-sm">{t("errorSummaryIntro")}</p>
          <ul className="mt-4 grid gap-2">
            {errorEntries.map(({field, error}) => (
              <li key={field}>
                <a
                  className="text-ui font-medium underline decoration-1 underline-offset-4 hover:text-alva-green"
                  href={`#${FIELD_IDS[field]}`}
                  onClick={(clickEvent) => {
                    clickEvent.preventDefault();
                    focusTarget(field);
                  }}
                >
                  {labelFor(field)}
                </a>
                <span className="text-ui-sm"> — {errorMessage(error)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        className={cn(
          "mb-8 rounded-xl border-l-4 border-alva-blue bg-alva-paper p-5",
          submitFailure ? "block" : "sr-only"
        )}
        ref={alertRef}
        role="alert"
        tabIndex={-1}
      >
        {submitFailure ? content.error : null}
      </div>

      <div
        className={cn(
          "mb-8 rounded-xl border-l-4 border-alva-green bg-alva-paper p-5",
          success ? "block" : "sr-only"
        )}
        ref={successRef}
        role="status"
        tabIndex={-1}
      >
        {success ? content.success : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          className="sm:col-span-2"
          error={errors.inquiryType}
          label={fields.inquiryType.label}
          name="inquiryType"
          required
        >
          {({id, describedBy, invalid}) => (
            <select
              data-lenis-prevent
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={cn(
                CONTROL_CLASS,
                invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
              )}
              id={id}
              name="inquiryType"
              onChange={handleInquiryTypeChange}
              required
              value={values.inquiryType}
            >
              <option disabled value="">
                {t("inquiryPlaceholder")}
              </option>
              {(
                Object.entries(fields.inquiryType.options) as Array<
                  [InquiryType, string]
                >
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          error={errors.fullName}
          label={fields.fullName}
          name="fullName"
          required
        >
          {({id, describedBy, invalid}) => (
            <input
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="name"
              className={cn(
                CONTROL_CLASS,
                invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
              )}
              id={id}
              maxLength={FIELD_MAX_LENGTH.fullName}
              name="fullName"
              onChange={(event) => updateField("fullName", event.target.value)}
              required
              type="text"
              value={values.fullName}
            />
          )}
        </Field>

        <Field
          error={errors.email}
          label={fields.email}
          name="email"
          required
        >
          {({id, describedBy, invalid}) => (
            <input
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="email"
              autoCapitalize="none"
              className={cn(
                CONTROL_CLASS,
                invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
              )}
              id={id}
              inputMode="email"
              maxLength={FIELD_MAX_LENGTH.email}
              name="email"
              onChange={(event) => updateField("email", event.target.value)}
              required
              spellCheck={false}
              type="email"
              value={values.email}
            />
          )}
        </Field>

        <Field error={errors.company} label={fields.company} name="company">
          {({id, describedBy, invalid}) => (
            <input
              aria-describedby={describedBy}
              aria-invalid={invalid}
              autoComplete="organization"
              className={cn(
                CONTROL_CLASS,
                invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
              )}
              id={id}
              maxLength={FIELD_MAX_LENGTH.company}
              name="company"
              onChange={(event) => updateField("company", event.target.value)}
              type="text"
              value={values.company}
            />
          )}
        </Field>

        <Field
          error={errors.markets}
          hint={fields.markets.hint}
          label={fields.markets.label}
          name="markets"
        >
          {({id, describedBy, invalid}) => (
            <input
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={cn(
                CONTROL_CLASS,
                invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
              )}
              id={id}
              maxLength={FIELD_MAX_LENGTH.markets}
              name="markets"
              onChange={(event) => updateField("markets", event.target.value)}
              type="text"
              value={values.markets}
            />
          )}
        </Field>

        <Field
          className="sm:col-span-2"
          error={errors.description}
          extraDescribedBy={`${FIELD_IDS.description}-count`}
          hint={
            values.inquiryType === ""
              ? undefined
              : fields.description.hints[values.inquiryType]
          }
          label={fields.description.label}
          name="description"
          required
        >
          {({id, describedBy, invalid}) => (
            <div>
              <textarea
                data-lenis-prevent
                aria-describedby={describedBy}
                aria-invalid={invalid}
                className={cn(
                  CONTROL_CLASS,
                  "min-h-40 resize-y",
                  invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
                )}
                id={id}
                maxLength={DESCRIPTION_MAX_LENGTH}
                name="description"
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                required
                value={values.description}
              />
              <p
                className="mt-2 text-right text-caption"
                id={`${FIELD_IDS.description}-count`}
              >
                {t("charCount", {
                  count: descriptionLength,
                  max: DESCRIPTION_MAX_LENGTH
                })}
              </p>
              <span
                aria-live="polite"
                className="sr-only"
                role="status"
              >
                {characterNotice}
              </span>
            </div>
          )}
        </Field>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <span className="relative mt-1 size-5 shrink-0">
              <input
                aria-describedby={
                  errors.privacyAccepted
                    ? `${FIELD_IDS.privacyAccepted}-error`
                    : undefined
                }
                aria-invalid={Boolean(errors.privacyAccepted)}
                className="peer size-5 cursor-pointer appearance-none rounded border border-alva-blue bg-alva-paper checked:bg-alva-blue"
                id={FIELD_IDS.privacyAccepted}
                name="privacyAccepted"
                onChange={(event) =>
                  updateField("privacyAccepted", event.target.checked)
                }
                required
                type="checkbox"
                checked={values.privacyAccepted}
              />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto size-3.5 text-alva-paper opacity-0 peer-checked:opacity-100"
                fill="none"
                focusable="false"
                viewBox="0 0 14 14"
              >
                <path
                  d="m2.5 7.5 3 3 6-6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <label className="text-body" htmlFor={FIELD_IDS.privacyAccepted}>
              {content.privacyAcknowledgement.before}
              <Link
                className="underline decoration-1 underline-offset-4 hover:text-alva-green"
                href="/privacy-notice"
                onClick={(event) => event.stopPropagation()}
              >
                {content.privacyAcknowledgement.linkLabel}
              </Link>
              {content.privacyAcknowledgement.after}
              <span aria-hidden="true" className="ml-1">
                *
              </span>
              <span className="sr-only"> {t("required")}</span>
            </label>
          </div>
          {errors.privacyAccepted ? (
            <FieldError
              error={errors.privacyAccepted}
              id={`${FIELD_IDS.privacyAccepted}-error`}
            />
          ) : null}
          <p className="mt-2 pl-8 text-ui-sm">
            <Link
              className="underline decoration-1 underline-offset-4 hover:text-alva-green"
              href="/cookie-policy"
            >
              {t("cookiePolicyLink")}
            </Link>
          </p>
        </div>

        {isContactFieldVisible("website", values.inquiryType) ? (
          <Field error={errors.website} label={fields.website} name="website">
            {({id, describedBy, invalid}) => (
              <input
                aria-describedby={describedBy}
                aria-invalid={invalid}
                autoComplete="url"
                autoCapitalize="none"
                className={cn(
                  CONTROL_CLASS,
                  invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
                )}
                id={id}
                inputMode="url"
                maxLength={FIELD_MAX_LENGTH.website}
                name="website"
                onChange={(event) => updateField("website", event.target.value)}
                spellCheck={false}
                type="text"
                value={values.website}
              />
            )}
          </Field>
        ) : null}

        {isContactFieldVisible("role", values.inquiryType) ? (
          <Field error={errors.role} label={fields.role} name="role">
            {({id, describedBy, invalid}) => (
              <input
                aria-describedby={describedBy}
                aria-invalid={invalid}
                autoComplete="organization-title"
                className={cn(
                  CONTROL_CLASS,
                  invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
                )}
                id={id}
                maxLength={FIELD_MAX_LENGTH.role}
                name="role"
                onChange={(event) => updateField("role", event.target.value)}
                type="text"
                value={values.role}
              />
            )}
          </Field>
        ) : null}

        {isContactFieldVisible("country", values.inquiryType) ? (
          <Field error={errors.country} label={fields.country} name="country">
            {({id, describedBy, invalid}) => (
              <select
                data-lenis-prevent
                aria-describedby={describedBy}
                aria-invalid={invalid}
                autoComplete="country"
                className={cn(
                  CONTROL_CLASS,
                  invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
                )}
                id={id}
                name="country"
                onChange={(event) =>
                  updateField("country", event.target.value)
                }
                value={values.country}
              >
                <option value="">{t("countryPlaceholder")}</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        ) : null}

        {isContactFieldVisible("stage", values.inquiryType) ? (
          <Field error={errors.stage} label={fields.stage.label} name="stage">
            {({id, describedBy, invalid}) => (
              <select
                data-lenis-prevent
                aria-describedby={describedBy}
                aria-invalid={invalid}
                className={cn(
                  CONTROL_CLASS,
                  invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
                )}
                id={id}
                name="stage"
                onChange={(event) =>
                  updateField(
                    "stage",
                    event.target.value as BusinessStage | ""
                  )
                }
                value={values.stage}
              >
                <option value="">{t("stagePlaceholder")}</option>
                {(
                  Object.entries(fields.stage.options) as Array<
                    [BusinessStage, string]
                  >
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        ) : null}

        <Field
          error={errors.referralSource}
          label={fields.referralSource}
          name="referralSource"
        >
          {({id, describedBy, invalid}) => (
            <input
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={cn(
                CONTROL_CLASS,
                invalid ? CONTROL_INVALID_CLASS : CONTROL_VALID_CLASS
              )}
              id={id}
              maxLength={FIELD_MAX_LENGTH.referralSource}
              name="referralSource"
              onChange={(event) =>
                updateField("referralSource", event.target.value)
              }
              type="text"
              value={values.referralSource}
            />
          )}
        </Field>

        <div className="sm:col-span-2">
          <TurnstileWidget
            describedBy={
              errors.turnstile
                ? `${FIELD_IDS.turnstile}-error`
                : undefined
            }
            invalid={Boolean(errors.turnstile)}
            locale={locale}
            onTokenChange={setTurnstileToken}
            resetSignal={turnstileReset}
            siteKey={turnstileSiteKey}
          />
          {errors.turnstile ? (
            <FieldError
              error={errors.turnstile}
              id={`${FIELD_IDS.turnstile}-error`}
            />
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <button
            aria-busy={isSubmitting}
            className="group fill-down inline-flex min-h-12 w-full items-center justify-between gap-8 rounded-lg border border-alva-blue bg-alva-blue px-6 py-3 text-ui text-alva-paper disabled:cursor-not-allowed disabled:border-alva-stone disabled:bg-alva-stone disabled:text-alva-blue disabled:before:hidden sm:w-auto sm:min-w-56"
            disabled={isSubmitting}
            type="submit"
          >
            <span>{isSubmitting ? t("sending") : content.submit}</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
    </form>
  );
}
