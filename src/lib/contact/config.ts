import {SITE_URL} from "../site";
import type {
  ContactConfig,
  ContactConfigIssue,
  EmailMode
} from "./types";

/**
 * Cloudflare's documented test keys. They are safe to use in development and
 * are rejected in production: the test secret always validates, so accepting
 * it there would silently disable anti-bot protection. Production requires
 * real values or the API answers 503 SERVICE_UNAVAILABLE.
 *
 * - Site key that always passes: 1x00000000000000000000AA
 * - Secret key that always passes: 1x0000000000000000000000000000000AA
 */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET_KEY =
  "1x0000000000000000000000000000000AA";

function read(env: NodeJS.ProcessEnv, name: string): string {
  return env[name]?.trim() ?? "";
}

function hasHeaderBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

/**
 * Reads the contact configuration from the environment.
 *
 * Defaults:
 * - development/test: console email mode + Cloudflare test Turnstile keys.
 * - production: resend email mode and real Turnstile keys are required.
 *
 * An invalid `CONTACT_EMAIL_MODE` is preserved as `invalid` instead of being
 * silently replaced, so `getContactConfigIssues` can fail the request.
 */
export function getContactConfig(
  env: NodeJS.ProcessEnv = process.env
): ContactConfig {
  const isProduction = env.NODE_ENV === "production";
  const rawMode = read(env, "CONTACT_EMAIL_MODE").toLowerCase();

  let emailMode: EmailMode | "invalid";
  if (rawMode === "") {
    emailMode = isProduction ? "resend" : "console";
  } else if (rawMode === "console" || rawMode === "resend") {
    emailMode = rawMode;
  } else {
    emailMode = "invalid";
  }

  const configuredTurnstileSecret = read(env, "TURNSTILE_SECRET_KEY");
  const configuredTurnstileSite = read(env, "NEXT_PUBLIC_TURNSTILE_SITE_KEY");

  return {
    isProduction,
    emailMode,
    resendApiKey: read(env, "RESEND_API_KEY"),
    contactToEmail: read(env, "CONTACT_TO_EMAIL"),
    contactFromEmail: read(env, "CONTACT_FROM_EMAIL"),
    turnstileSecretKey:
      configuredTurnstileSecret ||
      (isProduction ? "" : TURNSTILE_TEST_SECRET_KEY),
    turnstileSiteKey:
      configuredTurnstileSite ||
      (isProduction ? "" : TURNSTILE_TEST_SITE_KEY),
    siteUrl: SITE_URL
  };
}

/**
 * Returns configuration problems that must turn into 503 SERVICE_UNAVAILABLE.
 * The returned values are safe, non-secret codes suitable for structured logs.
 */
export function getContactConfigIssues(
  config: ContactConfig
): ContactConfigIssue[] {
  const issues: ContactConfigIssue[] = [];

  switch (config.emailMode) {
    case "invalid":
      issues.push("CONTACT_EMAIL_MODE_INVALID");
      break;
    case "console":
      if (config.isProduction) {
        issues.push("CONTACT_EMAIL_MODE_CONSOLE_IN_PRODUCTION");
      }
      break;
    case "resend":
      if (
        !config.resendApiKey ||
        !config.contactToEmail ||
        !config.contactFromEmail ||
        hasHeaderBreak(config.contactToEmail) ||
        hasHeaderBreak(config.contactFromEmail)
      ) {
        issues.push("RESEND_NOT_CONFIGURED");
      }
      break;
  }

  if (config.isProduction) {
    /*
     * The documented test secret always validates. If it (or the test site
     * key) reaches production, anti-bot protection is effectively disabled,
     * so this is a configuration failure rather than a usable setup.
     */
    const usesTestTurnstileKey =
      config.turnstileSecretKey === TURNSTILE_TEST_SECRET_KEY ||
      config.turnstileSiteKey === TURNSTILE_TEST_SITE_KEY;

    if (usesTestTurnstileKey) {
      issues.push("TURNSTILE_TEST_KEY_IN_PRODUCTION");
    } else if (!config.turnstileSecretKey || !config.turnstileSiteKey) {
      issues.push("TURNSTILE_NOT_CONFIGURED");
    }
  }

  return issues;
}
