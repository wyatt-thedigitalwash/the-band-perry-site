import localFont from "next/font/local";

// Extracted from bandperry.com's own @font-face rule (kurilian-rg9lis) — the
// display face used for the logo/headings/nav on the legacy site.
export const kurilian = localFont({
  src: "../fonts/kurilian-rg9lis.woff2",
  variable: "--font-kurilian",
  display: "swap",
});
