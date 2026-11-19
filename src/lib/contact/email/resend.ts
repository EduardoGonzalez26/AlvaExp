import {Resend} from "resend";
import type {ContactConfig} from "../types";
import {ContactDeliveryError} from "./errors";
import {renderContactEmail} from "./template";
import type {SendContactEmail} from "./types";

const DEFAULT_SEND_TIMEOUT_MS = 10_000;

type ResendMessage = {
  from: string;
  to: string;
  subject: string;
  replyTo: string;
  html: string;
  text: string;
};

/**
 * Minimal structural view of the Resend client. Keeping it small makes the
 * adapter unit-testable without a network call or module mocking.
 */
export type ResendEmailClient = {
  emails: {
    send: (
      message: ResendMessage,
      options: {signal: AbortSignal}
    ) => Promise<{data: unknown; error: {name: string} | null}>;
  };
};

export type ResendSenderOptions = {
  client?: ResendEmailClient;
  timeoutMs?: number;
};

/**
 * Production adapter. The SDK request is aborted after 10 s. Provider error
 * messages are not forwarded or logged: only the Resend error code is kept.
 */
export function createResendEmailSender(
  config: ContactConfig,
  options: ResendSenderOptions = {}
): SendContactEmail {
  if (!config.resendApiKey || !config.contactToEmail || !config.contactFromEmail) {
    throw new ContactDeliveryError("resend_not_configured");
  }

  const client: ResendEmailClient =
    options.client ?? (new Resend(config.resendApiKey) as unknown as ResendEmailClient);
  const timeoutMs = options.timeoutMs ?? DEFAULT_SEND_TIMEOUT_MS;

  return async (payload, requestId) => {
    const {subject, html, text} = renderContactEmail(payload, requestId);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await client.emails.send(
        {
          from: config.contactFromEmail,
          to: config.contactToEmail,
          subject,
          replyTo: payload.email,
          html,
          text
        },
        {signal: controller.signal}
      );

      if (response.error) {
        throw new ContactDeliveryError(response.error.name);
      }
    } catch (error) {
      if (error instanceof ContactDeliveryError) {
        throw error;
      }
      throw new ContactDeliveryError(
        controller.signal.aborted ? "timeout" : "transport_error"
      );
    } finally {
      clearTimeout(timeout);
    }
  };
}
