import {describe, expect, it} from "vitest";
import {createRateLimiter, type RateLimitRule} from "../rate-limit";

function limiterAt(clock: {now: number}, rules?: readonly RateLimitRule[]) {
  return createRateLimiter({
    now: () => clock.now,
    cleanupIntervalMs: 0,
    ...(rules ? {rules} : {})
  });
}

describe("createRateLimiter", () => {
  it("allows 5 submissions per 10 minutes and blocks the 6th", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(limit("203.0.113.10").allowed).toBe(true);
    }

    const blocked = limit("203.0.113.10");
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBe(600);
    }
  });

  it("keeps buckets separate per key", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(limit("203.0.113.10").allowed).toBe(true);
    }

    expect(limit("203.0.113.10").allowed).toBe(false);
    expect(limit("203.0.113.11").allowed).toBe(true);
  });

  it("allows a new submission once the 10-minute window slides", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(limit("ip").allowed).toBe(true);
    }
    expect(limit("ip").allowed).toBe(false);

    clock.now = 10 * 60 * 1000 + 1;
    expect(limit("ip").allowed).toBe(true);
  });

  it("enforces the hourly limit independently", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock, [{limit: 20, windowMs: 60 * 60 * 1000}]);

    for (let attempt = 0; attempt < 20; attempt += 1) {
      expect(limit("ip").allowed).toBe(true);
    }

    const blocked = limit("ip");
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBe(3600);
    }
  });

  it("provides a retry-after for the strictest violated window", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      limit("ip");
      clock.now += 1_000;
    }

    // The 6th request is blocked by the 10-minute rule; the oldest entry needs
    // almost the full 10 minutes to leave the window.
    const blocked = limit("ip");
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(590);
      expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(600);
    }
  });

  it("forgets entries older than the largest window", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(limit("ip").allowed).toBe(true);
    }

    clock.now = 60 * 60 * 1000 + 1;
    expect(limit("ip").allowed).toBe(true);
  });

  it("uses the unknown bucket when the caller passes it", () => {
    const clock = {now: 0};
    const limit = limiterAt(clock);

    expect(limit("unknown").allowed).toBe(true);
  });
});
