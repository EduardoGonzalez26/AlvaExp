import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at "/", Spanish at "/es".
  localePrefix: "as-needed",
  // Preference cookie. The middleware reads it (then Accept-Language) to pick
  // a language on the first visit, and the language switcher updates it.
  //
  // Hardening: path "/" so every page can read the same preference, SameSite
  // Lax (sent on top-level navigation, not on cross-site subrequests) and
  // Secure in production (HTTPS). `HttpOnly` is not exposed by next-intl's
  // `localeCookie` API and the switcher writes this cookie from the browser,
  // so forcing it would be inconsistent. The cookie contains only "en"/"es":
  // no personal data. Document it in the Cookie Policy.
  localeCookie: {
    name: "NEXT_LOCALE",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    // The key is omitted outside production (instead of set to false):
    // next-intl's client-side switcher serializes any boolean `secure` as a
    // bare `secure` attribute, which would break the cookie on plain HTTP
    // development hosts.
    ...(process.env.NODE_ENV === "production" ? {secure: true} : {})
  },
  // hreflang is emitted once, through the Metadata API, so that every URL is
  // built from NEXT_PUBLIC_SITE_URL. The middleware's request-origin Link
  // header would be a second, possibly different, source of truth.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/how-we-work": {
      en: "/how-we-work",
      es: "/como-trabajamos"
    },
    "/why-latin-america": {
      en: "/why-latin-america",
      es: "/por-que-america-latina"
    },
    "/about": {
      en: "/about",
      es: "/nosotros"
    },
    "/start-a-conversation": {
      en: "/start-a-conversation",
      es: "/conversemos"
    },
    "/privacy-notice": {
      en: "/privacy-notice",
      es: "/aviso-de-privacidad"
    },
    "/cookie-policy": {
      en: "/cookie-policy",
      es: "/politica-de-cookies"
    }
  }
});
