import {logContactEvent, type ContactLogger} from "../log";
import type {SendContactEmail} from "./types";

/**
 * Development-only adapter. It never prints form values: only the request id,
 * inquiry type, locale and field lengths. The real delivery path is Resend.
 */
export function createConsoleEmailSender(
  logger: ContactLogger = logContactEvent
): SendContactEmail {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Console email mode is disabled in production.");
  }

  return async (payload, requestId) => {
    logger({
      event: "contact_email_console",
      requestId,
      inquiryType: payload.inquiryType,
      locale: payload.locale,
      fieldLengths: {
        fullName: payload.fullName.length,
        email: payload.email.length,
        company: payload.company?.length ?? 0,
        markets: payload.markets?.length ?? 0,
        description: payload.description.length,
        website: payload.website?.length ?? 0,
        role: payload.role?.length ?? 0,
        country: payload.country?.length ?? 0,
        stage: payload.stage?.length ?? 0,
        referralSource: payload.referralSource?.length ?? 0
      }
    });
  };
}
