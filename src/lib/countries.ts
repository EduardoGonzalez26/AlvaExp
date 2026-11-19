import type {Locale} from "@/content/types";

export type CountryOption = {
  /** ISO 3166-1 alpha-2 code, as the contact API expects. */
  value: string;
  /** Localized country name from ICU, for example "México" or "Germany". */
  label: string;
};

/**
 * ISO 3166-1 alpha-2 codes. The form submits the two-letter code, never the
 * localized name, so the API contract stays locale independent.
 */
const ISO_3166_ALPHA_2 = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ
EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS
YE YT
ZA ZM ZW
`
  .trim()
  .split(/\s+/);

export const ISO_COUNTRY_CODES: readonly string[] = ISO_3166_ALPHA_2;

const ISO_COUNTRY_CODE_SET = new Set(ISO_3166_ALPHA_2);

/**
 * Server-safe ISO 3166-1 alpha-2 check. Shared with the contact API so the
 * accepted values and the form options can never drift apart.
 */
export function isIsoCountryCode(value: string): boolean {
  return ISO_COUNTRY_CODE_SET.has(value);
}

/**
 * Country options sorted with the locale's collation. Built on the server and
 * passed to the client form, so the options are identical during SSR and
 * hydration even if the browser ICU data differs from Node's.
 */
export function getCountryOptions(locale: Locale): CountryOption[] {
  const displayNames = new Intl.DisplayNames([locale], {type: "region"});
  const collator = new Intl.Collator(locale, {sensitivity: "base"});

  return ISO_3166_ALPHA_2.map((code) => ({
    value: code,
    label: displayNames.of(code) ?? code
  })).sort((a, b) => collator.compare(a.label, b.label));
}
