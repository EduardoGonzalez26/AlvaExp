import {describe, expect, it, vi} from "vitest";
import {verifyTurnstileToken} from "../turnstile";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {"content-type": "application/json"}
  });
}

describe("verifyTurnstileToken", () => {
  it("posts secret, response and remoteip and accepts success=true", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({success: true})
    );

    const result = await verifyTurnstileToken("token-value", {
      secretKey: "secret-value",
      remoteIp: "203.0.113.10",
      fetchImpl: fetchMock
    });

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    );
    const init = call?.[1];
    expect(init?.method).toBe("POST");
    const body = init?.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret-value");
    expect(body.get("response")).toBe("token-value");
    expect(body.get("remoteip")).toBe("203.0.113.10");
  });

  it("omits remoteip when the IP is unknown", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({success: true})
    );

    await verifyTurnstileToken("token-value", {
      secretKey: "secret-value",
      remoteIp: "unknown",
      fetchImpl: fetchMock
    });

    const body = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(body.has("remoteip")).toBe(false);
  });

  it("returns false when Cloudflare answers success=false", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({success: false})
    );

    const result = await verifyTurnstileToken("token-value", {
      secretKey: "secret-value",
      fetchImpl: fetchMock
    });

    expect(result).toBe(false);
  });

  it("returns false for non-2xx responses", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({success: true}, 500)
    );

    const result = await verifyTurnstileToken("token-value", {
      secretKey: "secret-value",
      fetchImpl: fetchMock
    });

    expect(result).toBe(false);
  });

  it("returns false for network errors and invalid JSON", async () => {
    const throwingFetch = vi.fn(async () => {
      throw new Error("network down");
    });
    const invalidJsonFetch = vi.fn(
      async () => new Response("not json", {status: 200})
    );

    expect(
      await verifyTurnstileToken("token-value", {
        secretKey: "secret-value",
        fetchImpl: throwingFetch as unknown as typeof fetch
      })
    ).toBe(false);

    expect(
      await verifyTurnstileToken("token-value", {
        secretKey: "secret-value",
        fetchImpl: invalidJsonFetch as unknown as typeof fetch
      })
    ).toBe(false);
  });

  it("aborts after the timeout and returns false", async () => {
    const pendingFetch = vi.fn<typeof fetch>((...args) => {
      const init = args[1];
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const result = await verifyTurnstileToken("token-value", {
      secretKey: "secret-value",
      timeoutMs: 10,
      fetchImpl: pendingFetch
    });

    expect(result).toBe(false);
  });

  it("does not call Cloudflare without a token or secret", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({success: true})
    );

    expect(
      await verifyTurnstileToken("", {
        secretKey: "secret-value",
        fetchImpl: fetchMock
      })
    ).toBe(false);

    expect(
      await verifyTurnstileToken("token-value", {
        secretKey: "",
        fetchImpl: fetchMock
      })
    ).toBe(false);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
