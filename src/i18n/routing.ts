import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at "/", Spanish at "/es".
  localePrefix: "as-needed",
  // Preference cookie. The middleware reads it (then Accept-Language) to pick
  // a language on the first visit, and the language switcher updates it.
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
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
