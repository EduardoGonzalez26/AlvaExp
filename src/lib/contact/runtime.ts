import {randomUUID} from "node:crypto";
import {getContactConfig} from "./config";
import {sendContactEmail} from "./email";
import type {ContactDependencies} from "./handler";
import {logContactEvent} from "./log";
import {createRateLimiter} from "./rate-limit";
import {verifyTurnstileToken} from "./turnstile";

/**
 * Module-level limiter: one shared bucket set per server process. Best-effort
 * by design; see the note in rate-limit.ts.
 */
const rateLimit = createRateLimiter();

export const defaultContactDependencies: ContactDependencies = {
  getConfig: () => getContactConfig(),
  verifyTurnstile: (token, remoteIp, config) =>
    verifyTurnstileToken(token, {
      secretKey: config.turnstileSecretKey,
      remoteIp
    }),
  sendEmail: sendContactEmail,
  rateLimit,
  log: logContactEvent,
  now: () => Date.now(),
  randomId: () => randomUUID()
};
