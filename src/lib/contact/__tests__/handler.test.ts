import {describe, expect, it, vi} from "vitest";
import {
  TURNSTILE_TEST_SECRET_KEY,
  TURNSTILE_TEST_SITE_KEY
} from "../config";
import {ContactDeliveryError} from "../email/errors";
import {
  handleContactRequest,
  MAX_CONTACT_BODY_BYTES,
  type ContactDependencies
} from "../handler";
import type {RateLimitDecision} from "../rate-limit";
import type {ContactConfig} from "../types";
import {productionConfig, testConfig, validPayload} from "./fixtures";

const ENDPOINT = "http://localhost:3000/api/contact";

function createDeps(
  overrides: Partial<ContactDependencies> = {}
): ContactDependencies {
  return {
    getConfig: () => testConfig(),
    verifyTurnstile: vi.fn(async () => true),
    sendEmail: vi.fn(async () => undefined),
    rateLimit: vi.fn((): RateLimitDecision => ({allowed: true})),
    log: vi.fn(),
    now: () => 1_000,
    randomId: () => "req-test",
    ...overrides
  };
}

function makeJsonRequest(
  body: unknown,
  init: RequestInit = {}
): Request {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return new Request(ENDPOINT, {
    method: "POST",
    ...init,
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
}

async function responseBody(response: Response): Promise<{
  ok: boolean;
  code?: string;
  fieldErrors?: Record<string, string>;
}> {
  return (await response.json()) as {
    ok: boolean;
    code?: string;
    fieldErrors?: Record<string, string>;
  };
}

describe("POST /api/contact handler", () => {
  it("returns 200 and passes the normalized payload to the adapter", async () => {
    const deps = createDeps();
    const request = makeJsonRequest(
      validPayload({
        fullName: "  Ada   Lovelace ",
        country: "gb",
        turnstileToken: "turnstile-token"
      }),
      {
        headers: {
          origin: "https://alvaexpansion.com",
          referer: "https://alvaexpansion.com/start-a-conversation",
          "x-forwarded-for": "203.0.113.10, 10.0.0.1"
        }
      }
    );

    const response = await handleContactRequest(request, deps);

    expect(response.status).toBe(200);
    expect(await responseBody(response)).toEqual({ok: true});
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-request-id")).toBe("req-test");

    expect(deps.rateLimit).toHaveBeenCalledWith("203.0.113.10");
    expect(deps.verifyTurnstile).toHaveBeenCalledWith(
      "turnstile-token",
      "203.0.113.10",
      expect.anything()
    );

    const sendEmail = vi.mocked(deps.sendEmail);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const call = sendEmail.mock.calls[0];
    expect(call).toBeDefined();
    const [payload, requestId] = call!;
    expect(payload.fullName).toBe("Ada Lovelace");
    expect(payload.country).toBe("GB");
    expect(requestId).toBe("req-test");
  });

  it("uses the unknown rate-limit bucket when there is no IP", async () => {
    const deps = createDeps();
    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(200);
    expect(deps.rateLimit).toHaveBeenCalledWith("unknown");
    expect(deps.verifyTurnstile).toHaveBeenCalledWith(
      "turnstile-test-token",
      null,
      expect.anything()
    );
  });

  it("returns 405 for non-POST methods with Allow: POST", async () => {
    const deps = createDeps();
    const request = new Request(ENDPOINT, {method: "GET"});

    const response = await handleContactRequest(request, deps);

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "METHOD_NOT_ALLOWED"
    });
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 415 without a JSON Content-Type", async () => {
    const deps = createDeps();

    const missing = new Request(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(validPayload())
    });
    expect(
      await responseBody(await handleContactRequest(missing, deps))
    ).toMatchObject({ok: false, code: "UNSUPPORTED_MEDIA_TYPE"});

    const wrong = makeJsonRequest(validPayload(), {
      headers: {"content-type": "text/plain"}
    });
    expect(
      (await handleContactRequest(wrong, deps)).status
    ).toBe(415);
  });

  it("returns 413 for bodies larger than 32 KB", async () => {
    const deps = createDeps();
    const body = JSON.stringify({
      ...validPayload(),
      overflow: "x".repeat(MAX_CONTACT_BODY_BYTES)
    });

    expect(body.length).toBeGreaterThan(MAX_CONTACT_BODY_BYTES);

    const response = await handleContactRequest(makeJsonRequest(body), deps);

    expect(response.status).toBe(413);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "PAYLOAD_TOO_LARGE"
    });
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and non-object JSON", async () => {
    const deps = createDeps();

    const invalidJson = await handleContactRequest(
      makeJsonRequest("{not-json"),
      deps
    );
    expect(invalidJson.status).toBe(400);
    expect((await responseBody(invalidJson)).fieldErrors?._form).toBeTruthy();

    const arrayBody = await handleContactRequest(makeJsonRequest([]), deps);
    expect(arrayBody.status).toBe(400);
    expect((await responseBody(arrayBody)).fieldErrors?._form).toBeTruthy();
  });

  it("returns 400 with fieldErrors for validation failures", async () => {
    const deps = createDeps();
    const response = await handleContactRequest(
      makeJsonRequest({...validPayload(), email: "not-an-email"}),
      deps
    );

    expect(response.status).toBe(400);
    const body = await responseBody(response);
    expect(body.code).toBe("INVALID_INPUT");
    expect(body.fieldErrors?.email).toBeTruthy();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("rejects fields that do not apply to the inquiry type", async () => {
    const deps = createDeps();
    const response = await handleContactRequest(
      makeJsonRequest({...validPayload(), inquiryType: "other"}),
      deps
    );

    expect(response.status).toBe(400);
    const body = await responseBody(response);
    expect(body.fieldErrors?.website).toBeTruthy();
    expect(body.fieldErrors?.role).toBeTruthy();
    expect(body.fieldErrors?.country).toBeTruthy();
    expect(body.fieldErrors?.stage).toBeTruthy();
  });

  it("rejects a disallowed Origin and a mismatched Referer", async () => {
    const deps = createDeps();

    const badOrigin = await handleContactRequest(
      makeJsonRequest(validPayload(), {
        headers: {origin: "https://evil.example"}
      }),
      deps
    );
    expect(badOrigin.status).toBe(403);
    expect(await responseBody(badOrigin)).toMatchObject({
      ok: false,
      code: "FORBIDDEN_ORIGIN"
    });

    const badReferer = await handleContactRequest(
      makeJsonRequest(validPayload(), {
        headers: {
          origin: "https://alvaexpansion.com",
          referer: "https://evil.example/page"
        }
      }),
      deps
    );
    expect(badReferer.status).toBe(403);

    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("accepts a matching Referer without an Origin header", async () => {
    const deps = createDeps();
    const response = await handleContactRequest(
      makeJsonRequest(validPayload(), {
        headers: {referer: "https://alvaexpansion.com/start-a-conversation"}
      }),
      deps
    );

    expect(response.status).toBe(200);
  });

  it("returns 403 when Turnstile rejects the token", async () => {
    const deps = createDeps({
      verifyTurnstile: vi.fn(async () => false)
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(403);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "TURNSTILE_FAILED"
    });
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 403 when Turnstile throws", async () => {
    const deps = createDeps({
      verifyTurnstile: vi.fn(async () => {
        throw new Error("turnstile unavailable");
      })
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(403);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "TURNSTILE_FAILED"
    });
  });

  it("returns 429 with Retry-After when rate limited", async () => {
    const deps = createDeps({
      rateLimit: vi.fn(
        (): RateLimitDecision => ({allowed: false, retryAfterSeconds: 42})
      )
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("42");
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "RATE_LIMITED"
    });
    expect(deps.verifyTurnstile).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 502 when delivery fails and logs only a safe reason", async () => {
    const deps = createDeps({
      sendEmail: vi.fn(async () => {
        throw new ContactDeliveryError("resend_rate_limit_exceeded");
      })
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(502);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "DELIVERY_FAILED"
    });

    const logs = JSON.stringify(vi.mocked(deps.log).mock.calls);
    expect(logs).toContain("resend_rate_limit_exceeded");
    expect(logs).not.toContain("Ada");
    expect(logs).not.toContain("ada@example.com");
    expect(logs).not.toContain("Latin America expansion");
  });

  it("returns 503 in production when email delivery is not configured", async () => {
    const deps = createDeps({
      getConfig: () =>
        testConfig({isProduction: true, emailMode: "console"})
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(503);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "SERVICE_UNAVAILABLE"
    });
    expect(deps.rateLimit).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 503 in production when Resend values are incomplete", async () => {
    const deps = createDeps({
      getConfig: () => productionConfig({contactToEmail: ""})
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(503);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("returns 503 in production when Turnstile test keys are configured", async () => {
    const deps = createDeps({
      getConfig: () =>
        productionConfig({
          turnstileSecretKey: TURNSTILE_TEST_SECRET_KEY,
          turnstileSiteKey: TURNSTILE_TEST_SITE_KEY
        })
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(503);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "SERVICE_UNAVAILABLE"
    });
    expect(JSON.stringify(vi.mocked(deps.log).mock.calls)).toContain(
      "TURNSTILE_TEST_KEY_IN_PRODUCTION"
    );
    expect(deps.rateLimit).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("requires a Turnstile token in production", async () => {
    const deps = createDeps({
      getConfig: () => productionConfig()
    });

    const response = await handleContactRequest(
      makeJsonRequest({...validPayload(), turnstileToken: undefined}),
      deps
    );

    expect(response.status).toBe(403);
    expect(await responseBody(response)).toMatchObject({
      ok: false,
      code: "TURNSTILE_FAILED"
    });
    expect(deps.verifyTurnstile).not.toHaveBeenCalled();
  });

  it("allows a missing token only in development", async () => {
    const deps = createDeps();
    const response = await handleContactRequest(
      makeJsonRequest({...validPayload(), turnstileToken: undefined}),
      deps
    );

    expect(response.status).toBe(200);
    expect(deps.verifyTurnstile).not.toHaveBeenCalled();
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("verifies the token in production when present", async () => {
    const config: ContactConfig = productionConfig();
    const deps = createDeps({getConfig: () => config});

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(200);
    expect(deps.verifyTurnstile).toHaveBeenCalledWith(
      "turnstile-test-token",
      null,
      config
    );
  });

  it("returns 503 for unexpected internal failures without leaking details", async () => {
    const deps = createDeps({
      getConfig: () => {
        throw new Error("unexpected boom");
      }
    });

    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(503);
    const body = await responseBody(response);
    expect(body).toMatchObject({ok: false, code: "SERVICE_UNAVAILABLE"});
    expect(JSON.stringify(body)).not.toContain("boom");
  });

  it("never logs PII on the success path", async () => {
    const deps = createDeps();
    const response = await handleContactRequest(
      makeJsonRequest(validPayload()),
      deps
    );

    expect(response.status).toBe(200);
    const logs = JSON.stringify(vi.mocked(deps.log).mock.calls);
    expect(logs).toContain("req-test");
    expect(logs).toContain('"status":200');
    expect(logs).not.toContain("Ada");
    expect(logs).not.toContain("ada@example.com");
    expect(logs).not.toContain("Analytical Engines");
    expect(logs).not.toContain("Latin America expansion");
  });
});
