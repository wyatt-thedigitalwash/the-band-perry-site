import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/consent/CookieConsent";
import TermsGate from "@/components/consent/TermsGate";
import AnchorScroll from "@/components/shared/AnchorScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteSchema } from "@/lib/schema";
import { OG_DEFAULTS, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute base so the relative OG/Twitter image resolves to a full URL, which
  // social platforms require. Update if the production domain changes.
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    "The official site of The Band Perry. Stream the new music, watch the official videos, browse upcoming tour dates and tickets, and shop official merch.",
  // Site-wide default. The /legal routes each override this with index: false.
  robots: { index: true, follow: true },
  // Branded app icons live in /public and are declared here rather than through
  // the app/ file convention, so every reference is in one place.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  // Site-wide social share preview, so any shared bandperry.com link renders a
  // card. Pages re-declare these same defaults through pageUrls() -- see the
  // note there on why a page's openGraph replaces rather than extends this one.
  openGraph: OG_DEFAULTS,
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
};

// themeColor belongs to the viewport export in the App Router; keeping it in
// metadata logs a build warning and is ignored.
export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Artist + site entity, carried on every page. Individual pages add
            their own breadcrumb and content schema on top of this. */}
        <JsonLd data={siteSchema()} />
        {/* First focusable element on every page. Off-screen until focused, so
            keyboard and screen-reader users can jump past the header nav. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-[#AADCF8] focus:bg-black focus:px-4 focus:py-3 focus:text-sm focus:uppercase focus:tracking-[0.15em] focus:text-[#AADCF8]"
        >
          Skip to main content
        </a>
        <AnchorScroll />
        {children}
        {/* Cookie consent banner. Shows once per new visitor, persisted in
            localStorage; injects nothing before consent is granted. */}
        <CookieConsent />
        {/* Arbitration / class-action notice, shown once right after the cookie
            decision so it is never buried only in the footer. */}
        <TermsGate />
      </body>
    </html>
  );
}
