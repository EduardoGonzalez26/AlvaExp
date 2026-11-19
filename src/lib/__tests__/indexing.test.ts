import {afterEach, describe, expect, it} from "vitest";
import robots from "@/app/robots";
import {buildRobots, isSiteIndexable} from "../indexing";

const original = process.env.SITE_INDEXABLE;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_INDEXABLE;
  } else {
    process.env.SITE_INDEXABLE = original;
  }
});

describe("isSiteIndexable", () => {
  it("only enables indexing for the exact string true", () => {
    process.env.SITE_INDEXABLE = "true";
    expect(isSiteIndexable()).toBe(true);

    for (const value of [undefined, "", "false", "TRUE", "1", " true "]) {
      if (value === undefined) {
        delete process.env.SITE_INDEXABLE;
      } else {
        process.env.SITE_INDEXABLE = value;
      }
      expect(isSiteIndexable()).toBe(false);
    }
  });
});

describe("robots", () => {
  it("blocks all crawling and omits the sitemap while staging is closed", () => {
    process.env.SITE_INDEXABLE = "false";

    expect(robots()).toEqual({
      rules: {userAgent: "*", disallow: "/"}
    });
  });

  it("allows crawling and declares the sitemap when indexing is enabled", () => {
    process.env.SITE_INDEXABLE = "true";

    const result = robots();

    expect(result.rules).toEqual({userAgent: "*", allow: "/"});
    expect(String(result.sitemap)).toMatch(/\/sitemap\.xml$/);
  });
});

describe("buildRobots", () => {
  it("makes every page noindex, nofollow while the gate is closed", () => {
    process.env.SITE_INDEXABLE = "false";

    expect(buildRobots()).toEqual({index: false, follow: false});
    expect(buildRobots(true)).toEqual({index: false, follow: false});
  });

  it("keeps explicit noindex pages out of the index when the gate is open", () => {
    process.env.SITE_INDEXABLE = "true";

    expect(buildRobots(true)).toEqual({index: false, follow: true});
  });

  it("leaves regular pages indexable when the gate is open", () => {
    process.env.SITE_INDEXABLE = "true";

    expect(buildRobots()).toBeUndefined();
  });
});
