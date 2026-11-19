import type {ContactPayload} from "../schema";

/**
 * Email delivery port. Implementations must throw on failure; the HTTP layer
 * maps any rejection to 502 DELIVERY_FAILED. They must never log or return the
 * form values themselves.
 */
export type SendContactEmail = (
  payload: ContactPayload,
  requestId: string
) => Promise<void>;
