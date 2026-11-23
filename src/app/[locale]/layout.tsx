import type {Metadata, Viewport} from "next";
import {DM_Mono, Inter, Source_Serif_4} from "next/font/google";
import {notFound} from "next/navigation";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";
import {BRAND_ASSETS, BRAND_LOCKUP, OG_IMAGE_SIZE} from "@/content/brand";
import {routing} from "@/i18n/routing";
import {isSiteIndexable} from "@/lib/indexing";
import {siteUrl} from "@/lib/site";
import {SiteFooter} from "@/components/layout/SiteFooter";
import {SiteHeader} from "@/components/layout/SiteHeader";
import {RouteLoader} from "@/components/motion/RouteLoader";
import {PageMotion} from "@/components/motion/PageMotion";
import {SmoothScroll} from "@/components/motion/SmoothScroll";
import "../globals.css";

// Self-hosted by next/font (no request to Google at runtime). The "latin"
// subset covers every character used in English and Spanish.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

// Editorial serif for headings, with its italic for emphasis (brand decks).
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-source-serif"
});

// Mono for the small, widely tracked labels of the brand system.
const dmMono = DM_Mono({
  subsets: ["latin"],
  // 500 is the hover weight of the language selector.
  weight: ["400", "500"],
  display: "swap",
  // Secondary labels: do not compete with the headline fonts for the LCP.
  preload: false,
  variable: "--font-dm-mono"
});

/** Site-wide defaults. Every page overrides them through buildPageMetadata(). */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Alva",
  applicationName: "Alva",
  // Site-wide fallback. Pages override this through buildPageMetadata(); it
  // also covers 404 responses, which have no page metadata of their own.
  robots: isSiteIndexable() ? undefined : {index: false, follow: false},
  formatDetection: {telephone: false, email: false, address: false},
  icons: {
    icon: [
      {url: BRAND_ASSETS.favicon, type: "image/svg+xml"},
      {url: BRAND_ASSETS.icon32, type: "image/png", sizes: "32x32"},
      {url: BRAND_ASSETS.icon192, type: "image/png", sizes: "192x192"},
      {url: BRAND_ASSETS.icon512, type: "image/png", sizes: "512x512"},
      {url: BRAND_ASSETS.faviconIco, sizes: "any"}
    ],
    apple: [
      {
        url: BRAND_ASSETS.appleIcon,
        type: "image/png",
        sizes: "180x180"
      }
    ]
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
    <html
      className={`${inter.variable} ${sourceSerif.variable} ${dmMono.variable}`}
      lang={locale}
      // Browser extensions often add attributes to <html>; ignore those.
      suppressHydrationWarning
    >
      <body className="bg-alva-paper font-sans text-alva-blue antialiased">
        {/* Only the strings used by Client Components travel to the browser. */}
        <NextIntlClientProvider messages={{Ui}}>
          <SmoothScroll />
          <PageMotion />
          <RouteLoader />
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
