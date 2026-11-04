/**
 * "Pistol" -- the 2026 single. Lives here so the Music page grid
 * (src/lib/releases.ts) reads its title, link and artwork from one place.
 */
export const PISTOL = {
  title: "Pistol",
  /**
   * Feature.fm smart link, the same routing every other CTA on the site uses
   * (see src/lib/releases.ts).
   */
  smartLink: "https://thebandperry.ffm.to/pistol.OWE",
  coverAlt: "Pistol single cover art by The Band Perry",
  cover: {
    src: "/images/music/Pistol.jpg",
    width: 1080,
    height: 1080,
  },
} as const;
