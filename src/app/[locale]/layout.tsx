import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import {notFound} from "next/navigation";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";
import {BRAND_ASSETS, BRAND_LOCKUP, OG_IMAGE_SIZE} from "@/content/brand";
import {routing} from "@/i18n/routing";
import {siteUrl} from "@/lib/site";
import {SiteFooter} from "@/components/layout/SiteFooter";
import {SiteHeader} from "@/components/layout/SiteHeader";
import "../globals.css";

// Self-hosted by next/font (no request to Google at runtime). The "latin"
// subset covers every character used in English and Spanish.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

/** Site-wide defaults. Every page overrides them through buildPageMetadata(). */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Alva",
  applicationName: "Alva",
  formatDetection: {telephone: false, email: false, address: false},
  icons: {
    icon: [{url: BRAND_ASSETS.favicon, type: "image/svg+xml"}]
  },
  openGraph: {
    type: "website",
    siteName: "Alva",
    images: [
      {
        url: BRAND_ASSETS.ogImage,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: BRAND_LOCKUP
      }
    ]
  },
  twitter: {card: "summary_large_image", images: [BRAND_ASSETS.ogImage]}
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F4F2EE"
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: "Ui"});
  const {Ui} = await getMessages();

  return (
    <html className={inter.variable} lang={locale}>
      <body className="bg-alva-paper font-sans text-alva-blue antialiased">
        {/* Only the strings used by Client Components travel to the browser. */}
        <NextIntlClientProvider messages={{Ui}}>
          <a
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-alva-blue focus:px-4 focus:py-3 focus:text-ui-sm focus:text-alva-paper"
            href="#main-content"
          >
            {t("skipToContent")}
          </a>
          <SiteHeader locale={locale} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
