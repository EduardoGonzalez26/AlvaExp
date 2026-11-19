import type {ContactPayload} from "../schema";
import type {InquiryType} from "../types";

export type RenderedContactEmail = {
  subject: string;
  html: string;
  text: string;
};

const INQUIRY_LABELS: Record<InquiryType, string> = {
  expansion: "Expansion",
  referral: "Referral",
  collaboration: "Collaboration",
  other: "Other"
};

const STAGE_LABELS: Record<string, string> = {
  early: "Early stage startup",
  growth: "Growth stage company",
  established: "Established company"
};

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    return HTML_ESCAPES[character] ?? character;
  });
}

function valueOrFallback(value: string | undefined): string {
  return value === undefined || value === "" ? "Not provided" : value;
}

/**
 * Builds the notification body. The Turnstile token is deliberately excluded:
 * it is a security artifact, not a form answer. All user-controlled values are
 * HTML-escaped. There are no attachments and no auto-response.
 */
export function renderContactEmail(
  payload: ContactPayload,
  requestId: string,
  timestamp: Date = new Date()
): RenderedContactEmail {
  const inquiryLabel = INQUIRY_LABELS[payload.inquiryType];
  const stage = payload.stage ? STAGE_LABELS[payload.stage] : undefined;

  const rows: Array<[string, string]> = [
    ["Inquiry type", `${inquiryLabel} (${payload.inquiryType})`],
    ["Full name", payload.fullName],
    ["Email", payload.email],
    ["Company or project", valueOrFallback(payload.company)],
    ["Markets considered", valueOrFallback(payload.markets)],
    ["Description", payload.description],
    ["Privacy Notice accepted", payload.privacyAccepted ? "Yes" : "No"],
    ["Website", valueOrFallback(payload.website)],
    ["Role", valueOrFallback(payload.role)],
    ["Country", valueOrFallback(payload.country)],
    ["Business stage", stage ? `${stage} (${payload.stage})` : "Not provided"],
    ["Heard about us", valueOrFallback(payload.referralSource)],
    ["Locale", payload.locale],
    ["Submitted at", timestamp.toISOString()],
    ["Request ID", requestId]
  ];

  const subject = `[Alva] New ${inquiryLabel} inquiry (${payload.locale.toUpperCase()})`;

  const text = [
    `New ${inquiryLabel} inquiry`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ""
  ].join("\n");

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr>` +
        `<th align="left" style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e5e5;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</th>` +
        `<td style="padding:8px 0;border-bottom:1px solid #e5e5e5;vertical-align:top;white-space:pre-wrap;">${escapeHtml(value)}</td>` +
        `</tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="${payload.locale}">
  <body style="margin:0;padding:24px;background:#f7f6f2;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;padding:24px;border:1px solid #e5e5e5;">
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">New ${escapeHtml(inquiryLabel)} inquiry</h1>
      <table role="presentation" style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.5;">
        ${tableRows}
      </table>
    </div>
  </body>
</html>`;

  return {subject, html, text};
}
