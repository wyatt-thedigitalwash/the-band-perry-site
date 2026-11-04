/**
 * "A Very Band Perry Christmas" -- the EP the splash gate promotes.
 *
 * Every string the splash renders lives here so the release can be updated (or
 * the whole gate retired) from one file. To promote a *different* release
 * later, change these values AND bump the suffix on SPLASH_STORAGE_KEY so
 * returning fans are shown the new gate.
 */
export const CHRISTMAS = {
  title: "A Very Band Perry Christmas",
  /** Machine-readable release date for the <time> element. */
  releaseDate: "2026-11-06",
  /** How the date reads in copy. */
  releaseLabel: "Available November 6",
  /** Sub-head under the date. */
  subhead: "Pre-Save / Pre-Order Now",
  /** Primary button label. */
  buttonLabel: "Pre-Save / Pre-Order",
  /**
   * Feature.fm smart link, the same routing every other CTA on the site uses
   * (see src/lib/releases.ts).
   */
  smartLink: "https://thebandperry.ffm.to/averybandperrychristmas.OWE",
  /** Square EP cover, used on the Music page grid. */
  cover: {
    src: "/images/music/a-very-band-perry-christmas.jpg",
    width: 960,
    height: 960,
    alt: "A Very Band Perry Christmas EP cover art by The Band Perry",
  },
  /** Textured lockup, transparent PNG. */
  lockup: {
    src: "/images/a-very-band-perry-christmas-lockup.png",
    width: 840,
    height: 339,
    alt: "A Very Band Perry Christmas",
  },
  /** Portrait key art, shared by the mobile and desktop layouts. */
  photo: {
    src: "/banners/TheBandPerry_ChristmasPhoto.jpg",
    width: 1434,
    height: 1920,
    alt: "The Band Perry beside a lit Christmas tree against a stone wall",
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
export const SPLASH_STORAGE_KEY = "tbp-splash-christmas";
