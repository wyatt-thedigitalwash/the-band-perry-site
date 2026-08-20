import type { Metadata } from "next";

/**
 * Single source of truth for the canonical origin and site name. Every
 * canonical URL, og:url, sitemap entry, robots Sitemap directive and JSON-LD
 * @id is derived from SITE_URL, so a domain change is a one-line edit here.
 */
export const SITE_URL = "https://www.bandperry.com";
export const SITE_NAME = "The Band Perry";

/**
 * Absolute URL for a route path ("/" or "/tour"). The home page resolves to the
 * bare origin with no trailing slash so it matches the canonical Next emits.
 */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** Site-wide share image, used by both Open Graph and Twitter cards. */
export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/**
 * The openGraph fields every page shares, minus the per-page url. Built fresh
 * per call so neither the layout nor a page can mutate the other's copy.
 */
function ogDefaults() {
  return {
    siteName: SITE_NAME,
    type: "website" as const,
    images: [{ ...OG_IMAGE }],
  };
}

/** Root-layout fallback for any route that does not call pageUrls(). */
export const OG_DEFAULTS = ogDefaults();

/**
 * Canonical link + the page's Open Graph block.
 *
 * Next merges metadata one level deep only: a page that declares `openGraph`
 * REPLACES the root layout's openGraph rather than extending it, which silently
 * drops og:image, og:type and og:site_name from that page. Spreading the shared
 * defaults here is what keeps those tags on every page while still setting the
 * per-page og:url. og:title / og:description / twitter:* are the exception --
 * Next fills those from the page's own title and description.
 */
export function pageUrls(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  const url = absoluteUrl(path);
  return {
    alternates: { canonical: url },
    openGraph: { ...ogDefaults(), url },
  };
}
