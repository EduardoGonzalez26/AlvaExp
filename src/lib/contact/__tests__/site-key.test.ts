import {describe, expect, it} from "vitest";
import {TURNSTILE_TEST_SITE_KEY} from "../config";
import {getTurnstileSiteKey} from "../site-key";

function env(values: Record<string, string | undefined>): NodeJS.ProcessEnv {
  return {...values} as NodeJS.ProcessEnv;
}

describe("getTurnstileSiteKey", () => {
  it("uses the configured site key", () => {
    expect(
      getTurnstileSiteKey(
        env({
          NODE_ENV: "production",
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: "  real-site-key  "
        })
      )
    ).toBe("real-site-key");
  });

  it("falls back to the documented test site key outside production", () => {
    expect(
      getTurnstileSiteKey(env({NODE_ENV: "development"}))
    ).toBe(TURNSTILE_TEST_SITE_KEY);
    expect(getTurnstileSiteKey(env({NODE_ENV: "test"}))).toBe(
      TURNSTILE_TEST_SITE_KEY
    );
  });

  it("returns null in production when the key is missing", () => {
    expect(
      getTurnstileSiteKey(
        env({NODE_ENV: "production", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "   "})
      )
    ).toBeNull();
  });
});
