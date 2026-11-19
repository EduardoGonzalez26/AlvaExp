import {getClientIp} from "./client-ip";
import {getContactConfigIssues} from "./config";
import {getDeliveryErrorReason} from "./email/errors";
import type {SendContactEmail} from "./email/types";
import type {ContactLogEvent, ContactLogger} from "./log";
import {isRequestOriginAllowed} from "./origin";
import type {RateLimitDecision} from "./rate-limit";
import {FORM_ERROR_KEY, validateContactPayload} from "./schema";
import {
  CONTACT_ERROR_STATUS,
  type ContactConfig,
  type ContactErrorCode,
  type ContactErrorResponse,
  type ContactFieldErrors,
  type ContactResponse
} from "./types";

/** Hard request-body limit: 32 KB. */
export const MAX_CONTACT_BODY_BYTES = 32 * 1024;

export type ContactDependencies = {
  getConfig: () => ContactConfig;
  verifyTurnstile: (
    token: string,
    remoteIp: string | null,
    config: ContactConfig
  ) => Promise<boolean>;
  sendEmail: SendContactEmail;
  rateLimit: (key: string) => RateLimitDecision;
  log: ContactLogger;
  now: () => number;
  randomId: () => string;
};

type BodyReadResult =
  | {kind: "ok"; text: string}
  | {kind: "too_large"}
  | {kind: "invalid"};

function errorBody(
  code: ContactErrorCode,
  fieldErrors?: ContactFieldErrors
): ContactErrorResponse {
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return {ok: false, code, fieldErrors};
  }
  return {ok: false, code};
}

function createJsonResponse(
  body: ContactResponse,
  status: number,
  requestId: string,
  extraHeaders?: Record<string, string>
): Response {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "x-request-id": requestId
  });

  for (const [name, value] of Object.entries(extraHeaders ?? {})) {
    headers.set(name, value);
  }

  return new Response(JSON.stringify(body), {status, headers});
}

function safeLog(logger: ContactLogger, event: ContactLogEvent): void {
  try {
    logger(event);
  } catch {
    // Logging must never turn a handled response into an unhandled error.
  }
}

/**
 * Reads the body as UTF-8 while enforcing the 32 KB limit on the stream, not
 * only on Content-Length (which can be missing or wrong).
 */
async function readRequestBody(request: Request): Promise<BodyReadResult> {
  if (!request.body) {
    return {kind: "ok", text: ""};
  }

  let reader: ReadableStreamDefaultReader<Uint8Array>;
  try {
    reader = request.body.getReader();
  } catch {
    return {kind: "invalid"};
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      if (!value) {
        continue;
      }

      total += value.byteLength;
      if (total > MAX_CONTACT_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        return {kind: "too_large"};
      }

      chunks.push(value);
    }
  } catch {
    return {kind: "invalid"};
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return {
      kind: "ok",
      text: new TextDecoder("utf-8", {fatal: true}).decode(merged)
    };
  } catch {
    return {kind: "invalid"};
  }
}

/**
 * POST /api/contact core handler.
 *
 * Dependencies are injected so integration tests can exercise the full flow
 * (method, headers, size, validation, rate limit, Turnstile, delivery) without
 * network calls. The route wrapper supplies the production dependencies.
 */
export async function handleContactRequest(
  request: Request,
  deps: ContactDependencies
): Promise<Response> {
  const requestId = deps.randomId();
  const startedAt = deps.now();

  const finish = (
    status: number,
    body: ContactResponse,
    extraHeaders?: Record<string, string>
  ): Response => {
    safeLog(deps.log, {
      event: "contact_request",
      requestId,
      status,
      durationMs: Math.max(0, deps.now() - startedAt),
      ...(body.ok ? {} : {errorCode: body.code})
    });
    return createJsonResponse(body, status, requestId, extraHeaders);
  };

  try {
    if (request.method.toUpperCase() !== "POST") {
      return finish(CONTACT_ERROR_STATUS.METHOD_NOT_ALLOWED, errorBody("METHOD_NOT_ALLOWED"), {
        allow: "POST"
      });
    }

    const config = deps.getConfig();
    const configIssues = getContactConfigIssues(config);

    if (configIssues.length > 0) {
      safeLog(deps.log, {
        event: "contact_config_error",
        requestId,
        configIssues
      });
      return finish(
        CONTACT_ERROR_STATUS.SERVICE_UNAVAILABLE,
        errorBody("SERVICE_UNAVAILABLE")
      );
    }

    if (!isRequestOriginAllowed(request, config.siteUrl)) {
      return finish(CONTACT_ERROR_STATUS.FORBIDDEN_ORIGIN, errorBody("FORBIDDEN_ORIGIN"));
    }

    const contentType = request.headers.get("content-type");
    if (
      !contentType ||
      !/^application\/json(?:\s*;.*)?$/i.test(contentType.trim())
    ) {
      return finish(
        CONTACT_ERROR_STATUS.UNSUPPORTED_MEDIA_TYPE,
        errorBody("UNSUPPORTED_MEDIA_TYPE")
      );
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength !== null) {
      const declaredLength = Number(contentLength);
      if (
        Number.isFinite(declaredLength) &&
        declaredLength > MAX_CONTACT_BODY_BYTES
      ) {
        return finish(
          CONTACT_ERROR_STATUS.PAYLOAD_TOO_LARGE,
          errorBody("PAYLOAD_TOO_LARGE")
        );
      }
    }

    const clientIp = getClientIp(request);
    const rate = deps.rateLimit(clientIp);
    if (!rate.allowed) {
      return finish(CONTACT_ERROR_STATUS.RATE_LIMITED, errorBody("RATE_LIMITED"), {
        "retry-after": String(rate.retryAfterSeconds)
      });
    }

    const bodyResult = await readRequestBody(request);
    if (bodyResult.kind === "too_large") {
      return finish(
        CONTACT_ERROR_STATUS.PAYLOAD_TOO_LARGE,
        errorBody("PAYLOAD_TOO_LARGE")
      );
    }
    if (bodyResult.kind === "invalid") {
      return finish(
        CONTACT_ERROR_STATUS.INVALID_INPUT,
        errorBody("INVALID_INPUT", {
          [FORM_ERROR_KEY]: "Could not read the request body."
        })
      );
    }
    if (bodyResult.text.trim() === "") {
      return finish(
        CONTACT_ERROR_STATUS.INVALID_INPUT,
        errorBody("INVALID_INPUT", {
          [FORM_ERROR_KEY]: "Request body is required."
        })
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(bodyResult.text);
    } catch {
      return finish(
        CONTACT_ERROR_STATUS.INVALID_INPUT,
        errorBody("INVALID_INPUT", {
          [FORM_ERROR_KEY]: "Request body must be valid JSON."
        })
      );
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return finish(
        CONTACT_ERROR_STATUS.INVALID_INPUT,
        errorBody("INVALID_INPUT", {
          [FORM_ERROR_KEY]: "Request body must be a JSON object."
        })
      );
    }

    const validation = validateContactPayload(parsed);
    if (!validation.success) {
      return finish(
        CONTACT_ERROR_STATUS.INVALID_INPUT,
        errorBody("INVALID_INPUT", validation.fieldErrors)
      );
    }

    const payload = validation.data;
    const turnstileToken = payload.turnstileToken;

    if (!turnstileToken) {
      if (config.isProduction) {
        return finish(
          CONTACT_ERROR_STATUS.TURNSTILE_FAILED,
          errorBody("TURNSTILE_FAILED")
        );
      }

      // Development-only convenience so the form can be tested before the
      // widget is wired. Production always requires a token and verification.
      safeLog(deps.log, {
        event: "contact_turnstile_skipped",
        requestId,
        reason: "missing_token_in_development"
      });
    } else {
      let verified = false;
      try {
        verified = await deps.verifyTurnstile(
          turnstileToken,
          clientIp === "unknown" ? null : clientIp,
          config
        );
      } catch {
        verified = false;
      }

      if (!verified) {
        return finish(
          CONTACT_ERROR_STATUS.TURNSTILE_FAILED,
          errorBody("TURNSTILE_FAILED")
        );
      }
    }

    try {
      await deps.sendEmail(payload, requestId);
    } catch (error) {
      safeLog(deps.log, {
        event: "contact_delivery_error",
        requestId,
        reason: getDeliveryErrorReason(error)
      });
      return finish(
        CONTACT_ERROR_STATUS.DELIVERY_FAILED,
        errorBody("DELIVERY_FAILED")
      );
    }

    return finish(200, {ok: true});
  } catch {
    safeLog(deps.log, {
      event: "contact_unexpected_error",
      requestId
    });
    return finish(
      CONTACT_ERROR_STATUS.SERVICE_UNAVAILABLE,
      errorBody("SERVICE_UNAVAILABLE")
    );
  }
}
