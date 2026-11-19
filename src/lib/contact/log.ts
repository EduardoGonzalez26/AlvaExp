/**
 * Structured logging for the contact endpoint.
 *
 * Only call this module with metadata: requestId, status, duration, error
 * codes, event names and field LENGTHS. Never pass names, email addresses,
 * message bodies or other PII; JSON lines are meant to be shipped to a log
 * aggregator.
 */
export type ContactLogEvent = {
  event: string;
  requestId?: string;
  status?: number;
  durationMs?: number;
  errorCode?: string;
  [key: string]: unknown;
};

export type ContactLogger = (event: ContactLogEvent) => void;

export function logContactEvent(event: ContactLogEvent): void {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...event
  });

  if (typeof event.status === "number" && event.status >= 500) {
    console.error(line);
  } else {
    console.info(line);
  }
}
