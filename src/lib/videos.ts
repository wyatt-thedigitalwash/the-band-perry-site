export type Video = {
  title: string;
  featuring?: string; // collaborator credit line, shown under the title
  youtubeId: string;
  year: string;
  date: string; // display date, e.g. "July 2026"
  released: string; // ISO upload date from YouTube, kept for ordering/reference
};

// Official music videos from the TheBandPerryVEVO channel, ordered newest first
// by their actual YouTube publish dates. The 2026 entries are the comeback-era
// releases; everything else is the original catalog. YouTube titles the
// "Don't Let Me Be Lonely" upload with a typo ("Lonley") -- corrected here.
export const VIDEOS: Video[] = [
  {
    title: "You Lie (Forever Version)",
    featuring: "with Kaitlin Butts",
    youtubeId: "4uSLJxbZ_wA",
    year: "2026",
    date: "July 2026",
    released: "2026-07-10",
  },
  {
    title: "Kill It",
    youtubeId: "LTkmDprieO0",
    year: "2026",
    date: "May 2026",
    released: "2026-05-29",
  },
  {
    title: "Buzzards",
    youtubeId: "YB-O3JAbPIc",
    year: "2026",
    date: "April 2026",
    released: "2026-04-24",
  },
  {
    title: "Psychological",
    youtubeId: "eyE7o8l_6xI",
    year: "2026",
    date: "February 2026",
    released: "2026-02-12",
  },
  {
    title: "Gentle On My Mind",
    youtubeId: "BuVJEn9wk9Y",
    year: "2014",
    date: "December 2014",
    released: "2014-12-15",
  },
  {
    title: "Chainsaw",
    youtubeId: "L7ULNxbDDdY",
    year: "2014",
    date: "May 2014",
    released: "2014-05-12",
  },
  {
    title: "Don't Let Me Be Lonely",
    youtubeId: "_3czgSzH7Cc",
    year: "2013",
    date: "November 2013",
    released: "2013-11-03",
  },
  {
    title: "Done.",
    youtubeId: "4emYaDbaJ8w",
    year: "2013",
    date: "April 2013",
    released: "2013-04-01",
  },
  {
    title: "Better Dig Two",
    youtubeId: "ZIdCo_QAz_E",
    year: "2012",
    date: "December 2012",
    released: "2012-12-04",
  },
  {
    title: "Postcard From Paris",
    youtubeId: "cO3PQ5onovo",
    year: "2012",
    date: "June 2012",
    released: "2012-06-04",
  },
  {
    title: "All Your Life",
    youtubeId: "mpdh4pPl0Ck",
    year: "2011",
    date: "August 2011",
    released: "2011-08-26",
  },
  {
    title: "You Lie",
    youtubeId: "pCwLsXZnFl4",
    year: "2011",
    date: "March 2011",
    released: "2011-03-04",
  },
  {
    title: "If I Die Young",
    youtubeId: "7NJqUN9TClM",
    year: "2010",
    date: "May 2010",
    released: "2010-05-28",
  },
  {
    title: "Hip To My Heart",
    youtubeId: "4cTI0gEZ_gg",
    year: "2010",
    date: "March 2010",
    released: "2010-03-02",
  },
];

// Every video on the channel has the 1280x720 maxres thumbnail (verified).
export function videoThumb(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}
