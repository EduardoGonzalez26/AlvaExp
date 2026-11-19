import {afterEach, describe, expect, it, vi} from "vitest";
import {createConsoleEmailSender} from "../email/console";
import {ContactDeliveryError} from "../email/errors";
import {
  createResendEmailSender,
  type ResendEmailClient
} from "../email/resend";
import {escapeHtml, renderContactEmail} from "../email/template";
import {validateContactPayload, type ContactPayload} from "../schema";
import {productionConfig, validPayload} from "./fixtures";

function makePayload(
  overrides: Record<string, unknown> = {}
): ContactPayload {
  const result = validateContactPayload(validPayload(overrides));
  if (!result.success) {
    throw new Error(`Invalid fixture: ${JSON.stringify(result.fieldErrors)}`);
  }
  return result.data;
}

describe("contact email template", () => {
  it("escapes HTML in every user-controlled value", () => {
    const payload = makePayload({
      fullName: '<script>alert("x")</script>',
      company: "A & B",
      description: "Line <one>\nLine two"
    });

    const {html, text} = renderContactEmail(
      payload,
      "request-123",
      new Date("2026-01-02T03:04:05.000Z")
    );

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("A &amp; B");
    expect(html).toContain("&lt;one&gt;");
    expect(text).toContain("A & B");
    expect(text).toContain("Line <one>");
    expect(escapeHtml(`'"&<>`)).toBe("&#39;&quot;&amp;&lt;&gt;");
  });

  it("includes the subject type/locale and all fields plus metadata", () => {
    const payload = makePayload();
    const {subject, html, text} = renderContactEmail(
      payload,
      "request-123",
      new Date("2026-01-02T03:04:05.000Z")
    );

    expect(subject).toContain("Expansion");
    expect(subject).toContain("EN");

    for (const value of [
      "Ada Lovelace",
      "ada@example.com",
      "Analytical Engines",
      "United Kingdom, Brazil",
      "Latin America expansion",
      "https://example.com",
      "Founder",
      "GB",
      "Early stage startup",
      "A trusted partner",
      "Yes",
      "request-123",
      "2026-01-02T03:04:05.000Z"
    ]) {
      expect(html).toContain(value);
      expect(text).toContain(value);
    }
  });

  it("does not include the Turnstile token in the message", () => {
    const payload = makePayload({turnstileToken: "super-secret-token"});
    const {html, text} = renderContactEmail(payload, "request-123");

    expect(html).not.toContain("super-secret-token");
    expect(text).not.toContain("super-secret-token");
  });
});

describe("console email adapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("logs lengths and metadata but never values", async () => {
    const logger = vi.fn();
    const sender = createConsoleEmailSender(logger);
    const payload = makePayload();

    await sender(payload, "request-123");

    expect(logger).toHaveBeenCalledTimes(1);
    const event = logger.mock.calls[0]?.[0];
    expect(event).toMatchObject({
      event: "contact_email_console",
      requestId: "request-123",
      inquiryType: "expansion",
      locale: "en"
    });

    const serialized = JSON.stringify(event);
    expect(serialized).not.toContain("Ada");
    expect(serialized).not.toContain("ada@example.com");
    expect(serialized).not.toContain("Analytical Engines");
    expect(serialized).not.toContain("Latin America expansion");
    expect(serialized).toContain("fieldLengths");
  });

  it("is disabled in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => createConsoleEmailSender()).toThrow(
      "Console email mode is disabled in production."
    );
  });
});

describe("resend email adapter", () => {
  const config = productionConfig();

  it("sends from/to, replyTo and escaped html/text through Resend", async () => {
    const send = vi.fn<
      (
        message: unknown,
        options: {signal: AbortSignal}
      ) => Promise<{data: unknown; error: {name: string} | null}>
    >(async () => ({
      data: {id: "email-id"},
      error: null
    }));
    const client = {emails: {send}} as unknown as ResendEmailClient;
    const sender = createResendEmailSender(config, {client});
    const payload = makePayload();

    await sender(payload, "request-123");

    expect(send).toHaveBeenCalledTimes(1);
    const call = send.mock.calls[0];
    const message = call?.[0] as {
      from: string;
      to: string;
      subject: string;
      replyTo: string;
      html: string;
      text: string;
    };

    expect(message.from).toBe(config.contactFromEmail);
    expect(message.to).toBe(config.contactToEmail);
    expect(message.replyTo).toBe(payload.email);
    expect(message.subject).toContain("Expansion");
    expect(message.subject).toContain("EN");
    expect(message.html).toContain("Ada Lovelace");
    expect(message.text).toContain("Ada Lovelace");

    const options = call?.[1] as {signal: AbortSignal};
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it("surfaces only the provider error code", async () => {
    const send = vi.fn(async () => ({
      data: null,
      error: {name: "rate_limit_exceeded"}
    }));
    const client = {emails: {send}} as unknown as ResendEmailClient;
    const sender = createResendEmailSender(config, {client});

    await expect(sender(makePayload(), "request-123")).rejects.toMatchObject({
      name: "ContactDeliveryError",
      reason: "rate_limit_exceeded"
    });
  });

  it("aborts and fails after the 10 s delivery timeout", async () => {
    const send = vi.fn<
      (
        message: unknown,
        options: {signal: AbortSignal}
      ) => Promise<{data: unknown; error: {name: string} | null}>
    >((...args) => {
      const options = args[1];
      return new Promise<{data: unknown; error: {name: string} | null}>(
        (_resolve, reject) => {
          options.signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }
      );
    });
    const client = {emails: {send}} as unknown as ResendEmailClient;
    const sender = createResendEmailSender(config, {client, timeoutMs: 10});

    await expect(sender(makePayload(), "request-123")).rejects.toMatchObject({
      name: "ContactDeliveryError",
      reason: "timeout"
    });
  });

  it("refuses to construct without complete configuration", () => {
    expect(() =>
      createResendEmailSender(productionConfig({resendApiKey: ""}))
    ).toThrow(ContactDeliveryError);
  });
});
