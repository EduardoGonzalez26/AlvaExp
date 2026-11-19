/**
 * Safe delivery failure. `reason` is a short internal code (provider error code
 * or transport/timeout marker), never a provider message that could contain
 * recipient details.
 */
export class ContactDeliveryError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super("Contact email delivery failed.");
    this.name = "ContactDeliveryError";
    this.reason = reason;
  }
}

export function getDeliveryErrorReason(error: unknown): string {
  return error instanceof ContactDeliveryError
    ? error.reason
    : "unexpected_error";
}
