import {describe, expect, it} from "vitest";
import {
  getCountryOptions,
  isIsoCountryCode,
  ISO_COUNTRY_CODES
} from "../countries";

describe("country options", () => {
  it("contains every ISO 3166-1 alpha-2 code once", () => {
    expect(ISO_COUNTRY_CODES).toHaveLength(249);
    expect(new Set(ISO_COUNTRY_CODES).size).toBe(249);

    for (const code of ISO_COUNTRY_CODES) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("validates codes against the shared ISO list", () => {
    expect(isIsoCountryCode("US")).toBe(true);
    expect(isIsoCountryCode("ZZ")).toBe(false);
    expect(isIsoCountryCode("UK")).toBe(false);
    expect(isIsoCountryCode("us")).toBe(false);
  });

  it("localizes names and uses the code as the submitted value", () => {
    const english = getCountryOptions("en");
    const spanish = getCountryOptions("es");

    expect(english.find((option) => option.value === "US")?.label).toBe(
      "United States"
    );
    expect(spanish.find((option) => option.value === "US")?.label).toBe(
      "Estados Unidos"
    );
    expect(spanish.find((option) => option.value === "MX")?.label).toBe(
      "México"
    );
  });

  it("sorts by the localized label", () => {
    const english = getCountryOptions("en");
    const labels = english.map((option) => option.label);
    const sorted = [...labels].sort(new Intl.Collator("en").compare);

    expect(labels).toEqual(sorted);
  });
});
