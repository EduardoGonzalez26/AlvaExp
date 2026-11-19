import {describe, expect, it} from "vitest";
import {
  getContactConfig,
  getContactConfigIssues,
  TURNSTILE_TEST_SECRET_KEY,
  TURNSTILE_TEST_SITE_KEY
} from "../config";

describe("contact configuration", () => {
  it("defaults to console mode and Turnstile test keys in development", () => {
    const config = getContactConfig({NODE_ENV: "development"});

    expect(config.isProduction).toBe(false);
    expect(config.emailMode).toBe("console");
    expect(config.turnstileSecretKey).toBe(TURNSTILE_TEST_SECRET_KEY);
    expect(config.turnstileSiteKey).toBe(TURNSTILE_TEST_SITE_KEY);
    expect(getContactConfigIssues(config)).toEqual([]);
  });

  it("defaults to resend in production and reports missing configuration", () => {
    const config = getContactConfig({NODE_ENV: "production"});

    expect(config.isProduction).toBe(true);
    expect(config.emailMode).toBe("resend");
    expect(config.turnstileSecretKey).toBe("");
    expect(config.turnstileSiteKey).toBe("");
    expect(getContactConfigIssues(config)).toEqual([
      "RESEND_NOT_CONFIGURED",
      "TURNSTILE_NOT_CONFIGURED"
    ]);
  });

  it("rejects console mode in production", () => {
    const config = getContactConfig({
      NODE_ENV: "production",
      CONTACT_EMAIL_MODE: "console",
      TURNSTILE_SECRET_KEY: "secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site"
    });

    expect(getContactConfigIssues(config)).toContain(
      "CONTACT_EMAIL_MODE_CONSOLE_IN_PRODUCTION"
    );
  });

  it("accepts fully configured production", () => {
    const config = getContactConfig({
      NODE_ENV: "production",
      CONTACT_EMAIL_MODE: "resend",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com",
      CONTACT_FROM_EMAIL: "Alva <no-reply@example.com>",
      TURNSTILE_SECRET_KEY: "turnstile-secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "turnstile-site"
    });

    expect(getContactConfigIssues(config)).toEqual([]);
  });

  it("reports an invalid email mode instead of silently defaulting", () => {
    const config = getContactConfig({
      NODE_ENV: "development",
      CONTACT_EMAIL_MODE: "smtp"
    });

    expect(config.emailMode).toBe("invalid");
    expect(getContactConfigIssues(config)).toContain(
      "CONTACT_EMAIL_MODE_INVALID"
    );
  });

  it("normalizes mode casing and whitespace", () => {
    const config = getContactConfig({
      NODE_ENV: "development",
      CONTACT_EMAIL_MODE: "  RESEND ",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com",
      CONTACT_FROM_EMAIL: "no-reply@example.com"
    });

    expect(config.emailMode).toBe("resend");
    expect(getContactConfigIssues(config)).toEqual([]);
  });

  it("requires all Resend values when resend mode is explicit", () => {
    const config = getContactConfig({
      NODE_ENV: "development",
      CONTACT_EMAIL_MODE: "resend",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com"
    });

    expect(getContactConfigIssues(config)).toContain("RESEND_NOT_CONFIGURED");
  });

  it("rejects CRLF in email header configuration", () => {
    const config = getContactConfig({
      NODE_ENV: "development",
      CONTACT_EMAIL_MODE: "resend",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com\r\nBcc: evil@example.com",
      CONTACT_FROM_EMAIL: "no-reply@example.com"
    });

    expect(getContactConfigIssues(config)).toContain("RESEND_NOT_CONFIGURED");
  });

  it("requires real Turnstile keys in production", () => {
    const config = getContactConfig({
      NODE_ENV: "production",
      CONTACT_EMAIL_MODE: "resend",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com",
      CONTACT_FROM_EMAIL: "no-reply@example.com",
      TURNSTILE_SECRET_KEY: "turnstile-secret"
    });

    expect(getContactConfigIssues(config)).toContain("TURNSTILE_NOT_CONFIGURED");
  });

  it("rejects Cloudflare's documented test keys in production", () => {
    const config = getContactConfig({
      NODE_ENV: "production",
      CONTACT_EMAIL_MODE: "resend",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com",
      CONTACT_FROM_EMAIL: "no-reply@example.com",
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEY,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEY
    });

    expect(getContactConfigIssues(config)).toEqual([
      "TURNSTILE_TEST_KEY_IN_PRODUCTION"
    ]);
  });

  it.each([
    ["the test secret", TURNSTILE_TEST_SECRET_KEY, "turnstile-site"],
    ["the test site key", "turnstile-secret", TURNSTILE_TEST_SITE_KEY]
  ])("rejects %s in production on its own", (_label, secret, site) => {
    const config = getContactConfig({
      NODE_ENV: "production",
      CONTACT_EMAIL_MODE: "resend",
      RESEND_API_KEY: "re_test",
      CONTACT_TO_EMAIL: "hello@example.com",
      CONTACT_FROM_EMAIL: "no-reply@example.com",
      TURNSTILE_SECRET_KEY: secret,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: site
    });

    expect(getContactConfigIssues(config)).toEqual([
      "TURNSTILE_TEST_KEY_IN_PRODUCTION"
    ]);
  });

  it("keeps accepting the documented test keys outside production", () => {
    const config = getContactConfig({
      NODE_ENV: "test",
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEY,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEY
    });

    expect(getContactConfigIssues(config)).toEqual([]);
  });
});
