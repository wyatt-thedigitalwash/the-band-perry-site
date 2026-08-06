export type Release = {
  title: string;
  year: string;
  cta: string; // button label as shown on the legacy site (Pre-Save / Listen / Click Here)
  href: string; // Feature.fm smart link
  art: string; // cover image in /public/images/music
  artAlt: string;
};

// The 2026 singles lead, newest first; the rest mirrors the legacy
// bandperry.com/music carousel. Every CTA is a Feature.fm smart link (ffm.to)
// that fans out to the DSPs, not a direct DSP URL.
// Note: several singles reuse the same album cover on the legacy site (the three
// "Pioneer"-era tracks share the Pioneer art; the self-titled/remastered tracks
// share that cover) -- reproduced faithfully here.
export const RELEASES: Release[] = [
  {
    title: "You Lie (Forever Version)",
    year: "2026",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/youlie-kb.OWE",
    art: "/images/music/you-lie-forever-version.jpg",
    artAlt: "You Lie (Forever Version) single cover art by The Band Perry with Kaitlin Butts",
  },
  {
    title: "Kill It",
    year: "2026",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/killit.OWE",
    art: "/images/music/kill-it.jpg",
    artAlt: "Kill It single cover art by The Band Perry",
  },
  {
    title: "Buzzards",
    year: "2026",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/buzzards.OWE",
    art: "/images/music/buzzards.jpg",
    artAlt: "Buzzards single cover art by The Band Perry",
  },
  {
    title: "Psychological",
    year: "2026",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/psychological.OWE",
    art: "/images/music/psychological.jpg",
    artAlt: "Psychological single cover art by The Band Perry",
  },
  {
    title: "If I Die Young",
    year: "2025",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/ifidieyoung",
    art: "/images/music/self-titled-remastered.png",
    artAlt: "The Band Perry self-titled (remastered) cover art",
  },
  {
    title: "Better Dig Two",
    year: "2013",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/betterdigtwo",
    art: "/images/music/self-titled-remastered.png",
    artAlt: "The Band Perry self-titled (remastered) cover art",
  },
  {
    title: "Done.",
    year: "2013",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/done",
    art: "/images/music/self-titled-remastered.png",
    artAlt: "The Band Perry self-titled (remastered) cover art",
  },
  {
    title: "You Lie",
    year: "2025",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/youlie",
    art: "/images/music/pioneer.jpg",
    artAlt: "The Band Perry Pioneer album cover art",
  },
  {
    title: "All Your Life",
    year: "2025",
    cta: "Click Here",
    href: "https://thebandperry.ffm.to/allyourlife",
    art: "/images/music/pioneer.jpg",
    artAlt: "The Band Perry Pioneer album cover art",
  },
  {
    title: "Chainsaw",
    year: "2013",
    cta: "Listen",
    href: "https://thebandperry.ffm.to/chainsaw",
    art: "/images/music/pioneer.jpg",
    artAlt: "The Band Perry Pioneer album cover art",
  },
];
