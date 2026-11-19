import {describe, expect, it} from "vitest";
import {
  buildContactPayload,
  createEmptyContactForm,
  filterVisibleErrors,
  isContactFieldVisible,
  mapServerFieldError,
  mapServerFieldErrors,
  validateContactForm,
  type ContactFormValues
} from "../form";

function validValues(
  overrides: Partial<ContactFormValues> = {}
): ContactFormValues {
  return {
    ...createEmptyContactForm(),
    inquiryType: "expansion",
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    description: "A short, nonconfidential overview.",
    privacyAccepted: true,
    ...overrides
  };
}

describe("contact form helpers", () => {
  describe("conditional field visibility", () => {
    it.each([
      ["website", "expansion", true],
      ["website", "referral", true],
      ["website", "collaboration", false],
      ["website", "other", false],
      ["role", "expansion", true],
      ["role", "referral", false],
      ["role", "collaboration", true],
      ["role", "other", false],
      ["country", "expansion", true],
      ["country", "referral", true],
      ["country", "collaboration", false],
      ["country", "other", false],
      ["stage", "expansion", true],
      ["stage", "referral", false],
      ["stage", "collaboration", false],
      ["stage", "other", false]
    ] as const)("%s with %s is %s", (field, inquiryType, expected) => {
      expect(isContactFieldVisible(field, inquiryType)).toBe(expected);
    });

    it("keeps general fields visible for every type and before a type is chosen", () => {
      for (const inquiryType of ["", "expansion", "referral", "collaboration", "other"] as const) {
        expect(isContactFieldVisible("fullName", inquiryType)).toBe(true);
        expect(isContactFieldVisible("referralSource", inquiryType)).toBe(true);
        expect(isContactFieldVisible("company", inquiryType)).toBe(true);
      }
    });

    it("hides every conditional field while no type is selected", () => {
      for (const field of ["website", "role", "country", "stage"] as const) {
        expect(isContactFieldVisible(field, "")).toBe(false);
      }
    });
  });

  describe("validation", () => {
    it("accepts the minimum valid form", () => {
      expect(validateContactForm(validValues())).toEqual({});
    });

    it("requires the inquiry type, name, email, description and privacy acceptance", () => {
      const errors = validateContactForm({
        ...createEmptyContactForm()
      });

      expect(errors.inquiryType?.key).toBe("requiredSelect");
      expect(errors.fullName?.key).toBe("required");
      expect(errors.email?.key).toBe("required");
      expect(errors.description?.key).toBe("required");
      expect(errors.privacyAccepted?.key).toBe("privacyRequired");
    });

    it("validates email format", () => {
      for (const email of ["plainaddress", "a@b", "a b@example.com"]) {
        expect(validateContactForm(validValues({email})).email?.key).toBe(
          "invalidEmail"
        );
      }
    });

    it("enforces every maximum with the same limits as the API", () => {
      expect(
        validateContactForm(validValues({fullName: "a".repeat(121)})).fullName
      ).toEqual({key: "tooLong", max: 120});

      expect(
        validateContactForm(validValues({company: "a".repeat(161)})).company
      ).toEqual({key: "tooLong", max: 160});

      expect(
        validateContactForm(validValues({markets: "a".repeat(201)})).markets
      ).toEqual({key: "tooLong", max: 200});

      expect(
        validateContactForm(validValues({description: "a".repeat(801)}))
          .description
      ).toEqual({key: "tooLong", max: 800});

      expect(
        validateContactForm(validValues({website: "a".repeat(301)})).website
      ).toEqual({key: "tooLong", max: 300});

      expect(
        validateContactForm(validValues({role: "a".repeat(121)})).role
      ).toEqual({key: "tooLong", max: 120});

      expect(
        validateContactForm(validValues({referralSource: "a".repeat(201)}))
          .referralSource
      ).toEqual({key: "tooLong", max: 200});

      expect(
        validateContactForm(
          validValues({email: `${"a".repeat(255)}@example.com`})
        ).email
      ).toEqual({key: "tooLong", max: 254});
    });

    it("accepts exactly the maximum lengths", () => {
      expect(
        validateContactForm(
          validValues({
            fullName: "a".repeat(120),
            company: "a".repeat(160),
            markets: "a".repeat(200),
            description: "a".repeat(800),
            website: "a".repeat(300),
            role: "a".repeat(120),
            referralSource: "a".repeat(200)
          })
        )
      ).toEqual({});
    });

    it("rejects line breaks in single-line fields but allows them in the description", () => {
      expect(
        validateContactForm(validValues({fullName: "Ada\nLovelace"})).fullName
      ).toEqual({key: "lineBreaks"});

      expect(
        validateContactForm(validValues({company: "Acme\r\nLtd"})).company
      ).toEqual({key: "lineBreaks"});

      expect(
        validateContactForm(validValues({description: "Line one\nLine two"}))
      ).toEqual({});
    });

    it("does not validate fields hidden by the inquiry type", () => {
      expect(
        validateContactForm(
          validValues({
            inquiryType: "other",
            website: "a".repeat(301),
            role: "a".repeat(121),
            country: "not-a-country",
            stage: "established"
          })
        )
      ).toEqual({});
    });
  });

  describe("payload assembly", () => {
    it("sends every applicable field and normalizes the country code", () => {
      const payload = buildContactPayload(
        validValues({
          company: "Analytical Engines",
          markets: "Mexico and Brazil",
          website: "example.com",
          role: "Founder",
          country: "gb",
          stage: "growth",
          referralSource: "A colleague"
        }),
        {locale: "en", turnstileToken: "turnstile-token"}
      );

      expect(payload).toMatchObject({
        inquiryType: "expansion",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        company: "Analytical Engines",
        markets: "Mexico and Brazil",
        description: "A short, nonconfidential overview.",
        privacyAccepted: true,
        website: "example.com",
        role: "Founder",
        country: "GB",
        stage: "growth",
        referralSource: "A colleague",
        locale: "en",
        turnstileToken: "turnstile-token"
      });
    });

    it("never sends values kept in fields hidden by the inquiry type", () => {
      const payload = buildContactPayload(
        validValues({
          inquiryType: "collaboration",
          website: "https://example.com",
          role: "Partner",
          country: "GB",
          stage: "early"
        }),
        {locale: "es"}
      );

      expect(payload.role).toBe("Partner");
      expect(payload.website).toBeUndefined();
      expect(payload.country).toBeUndefined();
      expect(payload.stage).toBeUndefined();
      expect(payload.turnstileToken).toBeUndefined();
    });

    it("omits empty optional fields", () => {
      const payload = buildContactPayload(validValues(), {locale: "en"});

      expect(payload.company).toBeUndefined();
      expect(payload.markets).toBeUndefined();
      expect(payload.website).toBeUndefined();
      expect(payload.role).toBeUndefined();
      expect(payload.country).toBeUndefined();
      expect(payload.stage).toBeUndefined();
      expect(payload.referralSource).toBeUndefined();
      expect(payload.privacyAccepted).toBe(true);
    });
  });

  describe("server error mapping", () => {
    it("maps the stable technical messages to localized UI keys", () => {
      expect(mapServerFieldError("This field is required.")).toEqual({
        key: "required"
      });
      expect(mapServerFieldError("Enter a valid email address.")).toEqual({
        key: "invalidEmail"
      });
      expect(mapServerFieldError("Line breaks are not allowed.")).toEqual({
        key: "lineBreaks"
      });
      expect(
        mapServerFieldError("You must accept the Privacy Notice.")
      ).toEqual({key: "privacyRequired"});
      expect(mapServerFieldError("Select a valid inquiry type.")).toEqual({
        key: "invalidInquiry"
      });
      expect(mapServerFieldError("Use a two-letter country code.")).toEqual({
        key: "invalidCountry"
      });
      expect(
        mapServerFieldError("Not available for this inquiry type.")
      ).toEqual({key: "notApplicable"});
      expect(mapServerFieldError("Unknown field.")).toEqual({
        key: "unknownField"
      });
      expect(mapServerFieldError("Invalid value.")).toEqual({
        key: "invalidValue"
      });
    });

    it("recovers the limit from a maximum-length message", () => {
      expect(mapServerFieldError("Must be at most 800 characters.")).toEqual({
        key: "tooLong",
        max: 800
      });
    });

    it("ignores form-level, unknown and hidden-field errors", () => {
      const errors = mapServerFieldErrors(
        {
          _form: "Request body is required.",
          notAField: "Unknown field.",
          fullName: "This field is required.",
          website: "Not available for this inquiry type.",
          role: "Not available for this inquiry type."
        },
        "other"
      );

      expect(errors.fullName).toEqual({key: "required"});
      expect(errors.website).toBeUndefined();
      expect(errors.role).toBeUndefined();
      expect(Object.keys(errors)).not.toContain("_form");
      expect(Object.keys(errors)).not.toContain("notAField");
    });
  });

  it("filters errors for hidden conditional fields but keeps turnstile errors", () => {
    const errors = filterVisibleErrors(
      {
        website: {key: "tooLong", max: 300},
        role: {key: "tooLong", max: 120},
        turnstile: {key: "verificationRequired"},
        fullName: {key: "required"}
      },
      "referral"
    );

    expect(errors.website).toBeDefined();
    expect(errors.role).toBeUndefined();
    expect(errors.turnstile).toBeDefined();
    expect(errors.fullName).toBeDefined();
  });
});
