import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/consent/CookieConsent";
import RouteTracker from "@/components/consent/RouteTracker";
import TermsGate from "@/components/consent/TermsGate";
import AnchorScroll from "@/components/shared/AnchorScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteSchema } from "@/lib/schema";
import { OG_DEFAULTS, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import SplashGate from "@/components/SplashGate";
import { SPLASH_STORAGE_KEY } from "@/lib/pistol";

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
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    // suppressHydrationWarning: the splash script below mutates the class list
    // before React hydrates, so server and client markup intentionally differ.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Adobe Fonts kit for the release toolkit's body face, Freight Sans
            Pro. The kit ships that family only, so Kurilian -- the headline
            face -- stays self-hosted through next/font (src/lib/fonts.ts).
            Typekit serves the @font-face rules from one host and the font files
            from another, so both get a preconnect. */}
        <link
          rel="preconnect"
          href="https://use.typekit.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://p.typekit.net"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/ahp1ofh.css" />

        {/* Splash gate, first paint. This has to be a blocking inline script:
            by the time React hydrates the gate has already been painted, so a
            visitor who entered earlier in this session would see it flash.
            Stamping the class here lets the CSS in globals.css hide it before
            the browser paints anything.

            `splash-entered` and `splash-exempt` are not interchangeable --
            entered means the visitor took an entry action, exempt only means
            the overlay is hidden because /legal is never gated. Reading the
            Terms must never count as agreeing to them, so a deep link to
            /legal gets the second class, and TermsGate offers the way in.

            Wrapped in try/catch because Safari's private mode throws on
            sessionStorage access. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var e=document.documentElement;if(sessionStorage.getItem(${JSON.stringify(
              SPLASH_STORAGE_KEY,
            )})){e.classList.add('splash-entered')}else if(location.pathname.indexOf('/legal')===0){e.classList.add('splash-exempt')}}catch(err){}`,
          }}
        />

        {/* The gate is dismissed by a button, so with scripting off it would be
            a wall in front of the site. Hide it there and those visitors land
            straight on the home page. */}
        <noscript>
          <style>{`#splash-overlay{display:none}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        {/* First child of <body> so it exists on the first paint. Shown once
            per browser session, on every route except /legal. */}
        <SplashGate />
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
        {/* Pageview tracking for client-side navigations. No-op until the
            advertising pixels have been consented to and injected. */}
        <RouteTracker />
        {/* Arbitration / class-action notice, shown once right after the cookie
            decision so it is never buried only in the footer. */}
        <TermsGate />
      </body>
    </html>
  );
}
