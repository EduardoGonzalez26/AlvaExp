import {describe, expect, it} from "vitest";
import {FORM_ERROR_KEY, validateContactPayload} from "../schema";
import {validPayload} from "./fixtures";

function expectFailure(
  overrides: Record<string, unknown>
): Record<string, string> {
  const result = validateContactPayload(validPayload(overrides));
  expect(result.success).toBe(false);
  if (result.success) {
    throw new Error("Expected validation to fail");
  }
  return result.fieldErrors;
}

function expectSuccess(overrides: Record<string, unknown> = {}) {
  const result = validateContactPayload(validPayload(overrides));
  if (!result.success) {
    throw new Error(`Expected validation to pass: ${JSON.stringify(result.fieldErrors)}`);
  }
  return result.data;
}

describe("contactPayloadSchema", () => {
  it("accepts a complete expansion payload and normalizes it", () => {
    const data = expectSuccess({
      fullName: "  Ada   Lovelace ",
      company: " Analytical   Engines ",
      country: "gb",
      inquiryType: " expansion ",
      locale: " en ",
      stage: " early "
    });

    expect(data.fullName).toBe("Ada Lovelace");
    expect(data.company).toBe("Analytical Engines");
    expect(data.country).toBe("GB");
    expect(data.inquiryType).toBe("expansion");
    expect(data.locale).toBe("en");
    expect(data.stage).toBe("early");
  });

  it.each([
    "inquiryType",
    "fullName",
    "email",
    "description",
    "privacyAccepted",
    "locale"
  ])("requires %s", (field) => {
    const errors = expectFailure({[field]: undefined});
    expect(errors[field]).toBeTruthy();
  });

  it("requires privacyAccepted to be true", () => {
    const errors = expectFailure({privacyAccepted: false});
    expect(errors.privacyAccepted).toContain("Privacy Notice");
  });

  it("rejects invalid inquiry types and locales", () => {
    expect(expectFailure({inquiryType: "partnership"}).inquiryType).toBeTruthy();
    expect(expectFailure({locale: "fr"}).locale).toBeTruthy();
  });

  it("enforces every documented maximum length", () => {
    const cases: Array<[string, number]> = [
      ["fullName", 120],
      ["company", 160],
      ["markets", 200],
      ["description", 800],
      ["website", 300],
      ["role", 120],
      ["referralSource", 200]
    ];

    for (const [field, max] of cases) {
      const errors = expectFailure({[field]: "a".repeat(max + 1)});
      expect(errors[field]).toBeTruthy();
    }
  });

  it("accepts exactly the maximum lengths", () => {
    expectSuccess({
      fullName: "a".repeat(120),
      company: "a".repeat(160),
      markets: "a".repeat(200),
      description: "a".repeat(800),
      website: "a".repeat(300),
      role: "a".repeat(120),
      referralSource: "a".repeat(200)
    });
  });

  it("rejects invalid email formats and email line breaks", () => {
    for (const email of [
      "plainaddress",
      "a@b",
      "a b@example.com",
      "ada@example.com\r\nBcc: evil@example.com"
    ]) {
      expect(expectFailure({email}).email).toBeTruthy();
    }
  });

  it("rejects CRLF in values used in email headers", () => {
    expect(expectFailure({fullName: "Ada\r\nLovelace"}).fullName).toBeTruthy();
    expect(
      expectFailure({company: "Acme\r\nBcc: evil@example.com"}).company
    ).toBeTruthy();
  });

  it("rejects wrong JSON types instead of coercing them", () => {
    expect(expectFailure({fullName: 42}).fullName).toBeTruthy();
    expect(expectFailure({privacyAccepted: "true"}).privacyAccepted).toBeTruthy();
    expect(expectFailure({privacyAccepted: 1}).privacyAccepted).toBeTruthy();
    expect(expectFailure({markets: ["BR"]}).markets).toBeTruthy();
    expect(expectFailure({stage: {}}).stage).toBeTruthy();
    expect(expectFailure({company: null}).company).toBeTruthy();
  });

  it("rejects unknown fields and reports each key", () => {
    const errors = expectFailure({unexpected: "value", another: 1});
    expect(errors.unexpected).toBe("Unknown field.");
    expect(errors.another).toBe("Unknown field.");
  });

  it("rejects non-object payloads", () => {
    for (const input of [[], null, "text", 42]) {
      const result = validateContactPayload(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors[FORM_ERROR_KEY]).toBeTruthy();
      }
    }
  });

  it("normalizes an empty optional country to absent", () => {
    const data = expectSuccess({country: "   "});
    expect(data.country).toBeUndefined();
  });

  it("accepts two-letter country codes in either case", () => {
    expect(expectSuccess({country: "us"}).country).toBe("US");
    expect(expectSuccess({country: " br "}).country).toBe("BR");
  });

  it("rejects non alpha-2 country values", () => {
    expect(expectFailure({country: "USA"}).country).toBeTruthy();
    expect(expectFailure({country: "1A"}).country).toBeTruthy();
    expect(expectFailure({country: "U"}).country).toBeTruthy();
  });

  it("rejects two-letter codes that are not in ISO 3166-1", () => {
    for (const country of ["ZZ", "XX", "UK", "EU", "zz"]) {
      expect(expectFailure({country}).country).toBeTruthy();
    }
  });

  it("accepts an ISO 3166-1 alpha-2 country and an empty value", () => {
    expect(expectSuccess({country: "mx"}).country).toBe("MX");
    expect(expectSuccess({country: ""}).country).toBeUndefined();
    expect(expectSuccess({country: "   "}).country).toBeUndefined();
  });

  it("normalizes description CRLF to LF", () => {
    const data = expectSuccess({description: "  Line one\r\nLine two  "});
    expect(data.description).toBe("Line one\nLine two");
  });

  it("treats optional empty strings as absent", () => {
    const data = expectSuccess({
      company: "",
      markets: "   ",
      website: "",
      role: "",
      country: "",
      stage: "",
      referralSource: ""
    });

    expect(data.company).toBeUndefined();
    expect(data.markets).toBeUndefined();
    expect(data.website).toBeUndefined();
    expect(data.role).toBeUndefined();
    expect(data.country).toBeUndefined();
    expect(data.stage).toBeUndefined();
    expect(data.referralSource).toBeUndefined();
  });

  it("allows turnstileToken to be omitted", () => {
    expectSuccess({turnstileToken: undefined});
  });

  describe("conditional field matrix", () => {
    it("allows website, role, country and stage for expansion", () => {
      expectSuccess({inquiryType: "expansion"});
    });

    it("allows website and country for referral but rejects role and stage", () => {
      expectSuccess({inquiryType: "referral", role: undefined, stage: undefined});

      const withRole = expectFailure({
        inquiryType: "referral",
        role: "Founder",
        stage: undefined
      });
      expect(withRole.role).toBeTruthy();

      const withStage = expectFailure({
        inquiryType: "referral",
        role: undefined,
        stage: "growth"
      });
      expect(withStage.stage).toBeTruthy();
    });

    it("allows role for collaboration but rejects website, country and stage", () => {
      expectSuccess({
        inquiryType: "collaboration",
        website: undefined,
        country: undefined,
        stage: undefined
      });

      const errors = expectFailure({
        inquiryType: "collaboration",
        website: "https://example.com",
        country: "GB",
        stage: "early"
      });
      expect(errors.website).toBeTruthy();
      expect(errors.country).toBeTruthy();
      expect(errors.stage).toBeTruthy();
      expect(errors.role).toBeUndefined();
    });

    it("rejects all four conditional fields for other", () => {
      const errors = expectFailure({
        inquiryType: "other",
        website: "https://example.com",
        role: "Founder",
        country: "GB",
        stage: "established"
      });
      expect(errors.website).toBeTruthy();
      expect(errors.role).toBeTruthy();
      expect(errors.country).toBeTruthy();
      expect(errors.stage).toBeTruthy();
    });

    it("does not reject blank disallowed fields", () => {
      expectSuccess({
        inquiryType: "other",
        website: "   ",
        role: "",
        country: "",
        stage: ""
      });
    });
  });
});
