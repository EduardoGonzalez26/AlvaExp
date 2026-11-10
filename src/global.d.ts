import type {routing} from "@/i18n/routing";
import type en from "../messages/en.json";

/**
 * Type-safe next-intl: translation keys and locales are checked at compile
 * time. English is the reference shape; Spanish must mirror it.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
