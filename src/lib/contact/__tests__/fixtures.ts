import type {ContactConfig} from "../types";

export function validPayload(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    inquiryType: "expansion",
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines",
    markets: "United Kingdom, Brazil",
    description: "We are exploring a Latin America expansion.",
    privacyAccepted: true,
    website: "https://example.com",
    role: "Founder",
    country: "GB",
    stage: "early",
    referralSource: "A trusted partner",
    locale: "en",
    turnstileToken: "turnstile-test-token",
    ...overrides
  };
}

export function testConfig(
  overrides: Partial<ContactConfig> = {}
): ContactConfig {
  return {
    isProduction: false,
    emailMode: "console",
    resendApiKey: "",
    contactToEmail: "",
    contactFromEmail: "",
    turnstileSecretKey: "1x0000000000000000000000000000000AA",
    turnstileSiteKey: "1x00000000000000000000AA",
    siteUrl: "https://alvaexpansion.com",
    ...overrides
  };
}

export function productionConfig(
  overrides: Partial<ContactConfig> = {}
): ContactConfig {
  return testConfig({
    isProduction: true,
    emailMode: "resend",
    resendApiKey: "re_test_key",
    contactToEmail: "hello@example.com",
    contactFromEmail: "Alva <no-reply@example.com>",
    turnstileSecretKey: "turnstile-secret",
    turnstileSiteKey: "turnstile-site",
    ...overrides
  });
}
