/**
 * Feature flags. `NEXT_PUBLIC_*` values are inlined at build time, so changing
 * a flag requires a rebuild.
 */

/**
 * Edgar Hintze's profile is pending his written approval. Only the exact
 * string "true" turns it on; unset or any other value keeps it hidden.
 */
export const showEdgarProfile =
  process.env.NEXT_PUBLIC_SHOW_EDGAR_PROFILE === "true";
