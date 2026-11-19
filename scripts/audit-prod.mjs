#!/usr/bin/env node
/**
 * Production dependency audit gate.
 *
 * Runs the equivalent of:
 *   npm audit --omit=dev --audit-level=high
 * and fails when an unallowlisted high or critical advisory affects a
 * production dependency. Development-only findings are ignored by
 * `--omit=dev`; they are tracked separately in DECISIONS.md.
 *
 * Allowlist (keep it short, reviewed and temporary):
 * - GHSA-fc5q-39xc-vjpf (picomatch ReDoS): no patched release is published
 *   yet. It reaches production through @parcel/watcher, a transitive
 *   dependency of next-intl, which is used by message-extraction tooling
 *   rather than by the runtime request path. Remove this entry as soon as a
 *   fixed picomatch is released and next-intl accepts it.
 *
 * Usage: node scripts/audit-prod.mjs
 */
import {spawnSync} from "node:child_process";

const ALLOWED_ADVISORIES = new Map([
  [
    "GHSA-fc5q-39xc-vjpf",
    "picomatch ReDoS; no patched release; reached via next-intl > @parcel/watcher"
  ]
]);

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(
  npmCommand,
  ["audit", "--omit=dev", "--audit-level=high", "--json"],
  {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    // Node cannot spawn .cmd files directly on Windows without a shell.
    shell: process.platform === "win32"
  }
);

if (result.error) {
  console.error(`audit-prod: could not run npm audit: ${result.error.message}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout || "{}");
} catch {
  console.error("audit-prod: npm audit did not return valid JSON.");
  if (result.stderr) {
    console.error(result.stderr.trim());
  }
  process.exit(1);
}

if (report.error) {
  console.error(`audit-prod: npm audit error: ${JSON.stringify(report.error)}`);
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities ?? {};

function advisoryIds(vulnerability) {
  return (vulnerability.via ?? [])
    .filter(
      (via) =>
        typeof via === "object" && via !== null && typeof via.url === "string"
    )
    .map((via) => via.url.match(/GHSA-[a-z0-9-]+/i)?.[0] ?? via.url);
}

/**
 * A vulnerability is allowed when every advisory that reaches it is
 * allowlisted. Packages whose `via` only lists other packages (for example
 * @parcel/watcher -> picomatch) inherit the decision from those packages.
 */
function isAllowed(name, seen = new Set()) {
  if (seen.has(name)) {
    return false;
  }
  seen.add(name);

  const vulnerability = vulnerabilities[name];
  if (!vulnerability) {
    return true;
  }

  const ids = advisoryIds(vulnerability);
  if (ids.length > 0) {
    return ids.every((id) => ALLOWED_ADVISORIES.has(id));
  }

  const parents = (vulnerability.via ?? []).filter(
    (via) => typeof via === "string"
  );

  return parents.length > 0 && parents.every((parent) => isAllowed(parent, seen));
}

const blocking = [];
let allowedHigh = 0;

for (const [name, vulnerability] of Object.entries(vulnerabilities)) {
  if (
    vulnerability.severity !== "high" &&
    vulnerability.severity !== "critical"
  ) {
    continue;
  }

  if (isAllowed(name)) {
    allowedHigh += 1;
    const ids = advisoryIds(vulnerability);
    console.warn(
      `audit-prod: allowed known risk: ${name} (${ids.join(", ") || "transitive"})`
    );
    continue;
  }

  blocking.push({
    name,
    severity: vulnerability.severity,
    via: vulnerability.via
  });
}

if (blocking.length > 0) {
  console.error(
    "audit-prod: unallowlisted high/critical production vulnerabilities:"
  );
  for (const item of blocking) {
    console.error(
      `- ${item.name} (${item.severity}) via ${JSON.stringify(item.via)}`
    );
  }
  process.exit(1);
}

console.log(
  `audit-prod: OK. No unallowlisted high/critical production vulnerabilities (${allowedHigh} allowlisted).`
);
