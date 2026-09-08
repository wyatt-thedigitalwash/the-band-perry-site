/**
 * "Pistol" -- the single the splash gate promotes.
 *
 * Every string the splash renders lives here so the release can be updated (or
 * the whole gate retired) from one file. Out now: `ctaLabel`/`buttonLabel` read
 * "Listen Now" and `smartLink` already points at the live listen link.
 * To promote a *different* release later, change these values AND bump the
 * suffix on SPLASH_STORAGE_KEY so returning fans are shown the new gate.
 */
export const PISTOL = {
  title: "Pistol",
  /** Machine-readable release date for the <time> element. */
  releaseDate: "2026-09-04",
  /** Opens the announcement line, ahead of the date. */
  leadIn: "New Single",
  /** How the date reads in copy. */
  releaseLabel: "Out Now",
  /** Ends the announcement line, so it reads as the call to action. */
  ctaLabel: "Listen Now",
  /** Standalone button in the top bar, where the line's phrasing is too long. */
  buttonLabel: "Listen Now",
  /**
   * Feature.fm smart link, the same routing every other CTA on the site uses
   * (see src/lib/releases.ts). Shared with the Music page's grid entry, which
   * imports it from here so the two can never drift apart.
   */
  smartLink: "https://thebandperry.ffm.to/pistol.OWE",
  bannerAlt: "Pistol single artwork by The Band Perry",
  coverAlt: "Pistol single cover art by The Band Perry",
  /** Square sleeve, used on the desktop split layout. */
  cover: {
    src: "/images/music/Pistol.jpg",
    width: 1080,
    height: 1080,
  },
  bannerDesktop: {
    src: "/banners/TheBandPerry_PistolBanner_Desktop.jpg",
    width: 1920,
    height: 1080,
  },
  bannerMobile: {
    src: "/banners/TheBandPerry_PistolBanner_Mobile.jpg",
    width: 900,
    height: 1600,
  },
} as const;

/**
 * sessionStorage key recording that this visitor has already passed the gate.
 * Session-scoped on purpose: the splash greets each new visit once, rather than
 * on every return to the home page (annoying) or exactly once ever (invisible
 * to fans who came back the next day and never saw the announcement).
 *
 * Read twice: by the blocking script in the root layout, which hides the gate
 * before first paint, and by SplashGate itself, which then unmounts it. Both
 * import this constant, so the two can never drift apart.
 */
export const SPLASH_STORAGE_KEY = "tbp-splash-pistol";
