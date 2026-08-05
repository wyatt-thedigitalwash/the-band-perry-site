import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/consent/CookieConsent";
import TermsGate from "@/components/consent/TermsGate";
import AnchorScroll from "@/components/shared/AnchorScroll";

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
  metadataBase: new URL("https://bandperry.com"),
  title: "The Band Perry",
  description: "The Band Perry website.",
  // Site-wide social share preview. Individual pages override title/description
  // but inherit this image, so any shared bandperry.com link renders a card.
  openGraph: {
    siteName: "The Band Perry",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1500,
        height: 1091,
        alt: "The Band Perry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.png"],
  },
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
