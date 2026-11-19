import {getContactConfig, getContactConfigIssues} from "../config";
import type {ContactPayload} from "../schema";
import {createConsoleEmailSender} from "./console";
import {ContactDeliveryError} from "./errors";
import {createResendEmailSender} from "./resend";
import type {SendContactEmail} from "./types";

export type {SendContactEmail} from "./types";
export {ContactDeliveryError, getDeliveryErrorReason} from "./errors";

/**
 * Dispatches to the configured email adapter.
 *
 * The route handler validates the configuration first and returns 503 before
 * reaching this function. The checks below are defence in depth: a production
 * request can never silently fall back to console mode or a fake success.
 */
export async function sendContactEmail(
  payload: ContactPayload,
  requestId: string
): Promise<void> {
  const config = getContactConfig();
  const issues = getContactConfigIssues(config);

  if (issues.length > 0) {
    throw new ContactDeliveryError("email_not_configured");
  }

  if (config.emailMode === "console") {
    const sender = createConsoleEmailSender();
    await sender(payload, requestId);
    return;
  }

  if (config.emailMode === "resend") {
    const sender = createResendEmailSender(config);
    await sender(payload, requestId);
    return;
  }

  throw new ContactDeliveryError("email_mode_invalid");
}

export type ContactEmailSender = SendContactEmail;
