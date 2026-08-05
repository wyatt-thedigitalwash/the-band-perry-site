# bandperry.com — Legacy Site Extraction

Full reference archive of the live Squarespace site at bandperry.com, captured 2026-07-26. This is source material for the rebuild only, nothing here is wired into the app, and nothing under `public/` was touched. Pages crawled: Home (`/` and `/home`), Tour (`/tour`), Music (`/music`), About (`/about`). Shop and Subscribe are external nav links, not pages on this site, so they were recorded (see url-inventory.csv) but not archived as pages.

## Directory contents

```
reference/legacy-site/
  images/          12 downloaded assets, native formats, largest available resolution
  copy/             home.md, tour.md, music.md, about.md — verbatim page text + meta tags
  data/             tour-dates.json (cleaned snapshot), bandsintown-raw-response.json (raw API response)
  url-inventory.csv one row per URL discovered, for the 301 redirect map
  EXTRACTION.md     this file
```

## Page-by-page summary

**Home (`/`, also served at `/home`)** — Fullest page on the site. Logo header, a large hero photo with a notched-frame border treatment, a "TOUR" heading followed by the complete live tour date list (same block as the Tour page), a lace-heart divider graphic, a "SUBSCRIBE TO EMAIL" button pointing off-site to beacons.ai, and the site-wide footer. Content is substantial for the tour section (data-driven) but thin everywhere else — there's no on-page narrative copy at all on Home, all storytelling lives on About.

**Tour (`/tour`)** — Thinnest page structurally, but the richest in *data*. Just a "TOUR" heading and the date list, no hero image, no subscribe CTA. All 23 currently-listed dates are live-fetched from Bandsintown at request time (see Tour Data Source Findings below) — this page has no static copy to speak of beyond the heading.

**Music (`/music`)** — Medium fullness. A horizontal carousel of 7 release cards (title, year, one CTA button each), all art and metadata present, but zero descriptive copy — no track descriptions, no album context, just cover art + title + year + a Feature.fm smart link. Would benefit from added copy in the rebuild (album credits, streaming stats, etc.) if the client wants more than a bare link list.

**About (`/about`)** — Only page with real prose: two paragraphs of band bio under an "OUR STORY" heading, alongside a photo of the duo (also using the notched-frame treatment seen on the Home hero). This page's background renders differently from the other three (near-white/light behind the heading, dark behind the photo+text section) — flagged as either an intentional two-tone layout or a Squarespace inconsistency; worth a decision before rebuild, not something to blindly replicate.

## Downloaded images

All 12 files below live in `images/`. Every file was requested at Squarespace's `?format=2500w` tier with an explicit `Accept: image/png,image/jpeg,...` header — without that header the CDN silently serves WebP regardless of the requested extension or `format=original`, which would have violated the "don't convert formats" instruction. All files below are confirmed to actually be PNG/JPEG (verified with `file`), matching the extension pattern of the original Squarespace filename.

| Filename | Depicts | Dimensions | Alt text (verbatim) | Appears on |
|---|---|---|---|---|
| `logo-horizontal-wordmark-blue-textured.png` | Full "The Band Perry" wordmark logo, distressed blue texture | 2326×583 | "The Band Perry" | Header, all 4 pages |
| `logo-monogram-abbreviation-blue-textured.png` | Abbreviated/monogram logo mark, same blue texture treatment | 618×583 | "The Band Perry" | Header (alternate state), all 4 pages |
| `background-texture-black-variant-a.jpg` | Full-bleed black grain/texture background | 2500×1500 | (none) | Tour, Music, About |
| `background-texture-black-variant-b.jpg` | Same black grain/texture background, second Squarespace asset ID | 2500×1500 | (none) | Home, Tour, Music, About |
| `hero-photo-home-header.png` | Homepage hero photo, duo lying on a bed | 2500×1500 | "Blonde woman lying on a patterned pillow next to blonde man" | Home |
| `divider-lace-heart-tbp-monogram.png` | Lace doily heart graphic with "TBP" monogram, section divider | 2500×2500 | "Lace white heart doily with a floral boarder and initials \"TBP\" in the center" | Home (above Subscribe button) |
| `album-art-psychological-single-2026.jpg` | Lace-heart cover art for "PSYCHOLOGICAL" single | 2500×2500 | "Heart lace design with blue text that says \"Psycho Logical\" and \"The Band Perry\"" | Music carousel (Psychological) |
| `album-art-self-titled-remastered-2025.png` | Self-titled album cover, "Remastered" text overlay | **1000×1000 only** | "Blonde woman in center with hands on hip between two men with black hair. Text \"The Band Perry Remastered\" centered" | Music carousel (If I Die Young, Better Dig Two, Done.) |
| `album-art-pioneer-deluxe-cover-2013.jpg` | "Pioneer" deluxe album cover | 2500×2500 | "Blonde woman in center between two men with black hair. Text \"Pioneer The Band Perry\" centered" | Music carousel (You Lie, All Your Life, Chainsaw) |
| `about-page-photo-duo-sitting.png` | Duo sitting against a weathered wall, notched-frame treatment | 1103×1607 | "A man and woman sitting on the floor against a weathered wall with peeling paint and exposed drywall in an old building. The woman has long blonde hair and wears a light gray dress and black lace-up boots. The man has blond hair, wears a black leather jacket, cream-colored pants, and black shoes, with his arms crossed and looking to the right." | About |
| `og-social-preview-home.png` | Squarespace's auto-generated social-share crop of the hero photo | 1500×1091 | (n/a — meta tag image, no alt attribute) | og:image / twitter:image, all 4 pages |
| `favicon.ico` | Browser tab icon | 1010×1022 | (n/a) | All pages (site-wide) |

Note on `favicon.ico`: despite the `.ico` extension in Squarespace's own URL, the file Squarespace actually serves is PNG-encoded, not a true multi-resolution ICO. The rebuild will need a proper favicon/ICO set generated from source art rather than reusing this file directly.

## Links and smart links

Full detail with status codes lives in `url-inventory.csv`. Summary:

- **Shop** (nav) → external, `https://thebandperry.colortestmerch.com/` — a separate merch storefront, not a Squarespace commerce page on this site.
- **Subscribe** (nav) → external, `https://beacons.ai/thebandperry/emaillist` — loads fine in a browser (title confirms "PSYCHOLOGICAL, MERCH DROP" beacon page) but returns HTTP 403 to a plain `curl` request, which is bot-protection on beacons.ai's end, not a broken link.
- **Footer socials**: TikTok, Instagram, X, YouTube (channel-ID URL — note Bandsintown's own artist record lists the `@TheBandPerry` handle URL instead, both resolve to the same channel), Facebook, Spotify, Apple Music (`/gb/` UK storefront locale in the URL as published).
- **Music page smart links** (all 7, all Feature.fm / `ffm.to`): Psychological (Pre-Save), If I Die Young, Better Dig Two, Done., You Lie, All Your Life (the one CTA labeled "Click Here" instead of "Listen"), Chainsaw. Full release → link → artwork mapping is in `copy/music.md`.
  - Checked one smart link (Psychological) end to end in a real browser: the landing page fans out to Spotify, Apple Music, Amazon Music, Pandora, YouTube Music, a Deezer-style icon, a "Download" (purchase) option, and a "Watch" button to YouTube. The individual per-service destination URLs are **not** exposed as static hrefs, every button points at the same `api.ffm.to/sl/e/c/<slug>` tracking endpoint and the real DSP redirect is resolved client-side after a click. This is expected smart-link behavior, not a data-quality issue, just noting it so nobody goes looking for a static per-service URL that doesn't exist in the page source.

## Tour data source findings

The Tour Dates block on both `/tour` and Home is a native Squarespace block (`sqs-block-tourdates`) whose config is embedded directly in the page HTML:

```
data-block-json="{"artistId":"The Band Perry","timeframe":"upcoming","startDate":1727758800000,"endDate":1735711200000}"
```

That block renders empty in the server-side HTML (`<!-- The Tour Dates Block is rendered by Handlebars. -->` with nothing inside) — the actual dates are fetched **client-side**, confirmed via a captured network request:

```
GET https://rest.bandsintown.com/artists/The%20Band%20Perry/events?app_id=squarespace-the-band-perry&date=upcoming
```

Key findings:
- **Artist identifier**: name-based (`"The Band Perry"`, URL-encoded), not Bandsintown's internal numeric artist ID. The numeric ID does exist and is visible in the response payload (`artist.id = "386741"`), but the request itself is keyed by name.
- **`app_id`**: `squarespace-the-band-perry` — this is Squarespace's own registered Bandsintown app_id, issued to Squarespace as a platform partner, not something tied to this specific site or something we can reuse. **To run this feed ourselves in the rebuild, we would need to register our own Bandsintown `app_id`** (free, self-service at Bandsintown's developer portal) and call the same `rest.bandsintown.com/artists/{name-or-id}/events` endpoint directly, or use the numeric artist ID (`386741`) instead of the name for a more stable match.
- No authentication/API key beyond the `app_id` query param is required, this is Bandsintown's public read-only events API.
- A snapshot of the raw response is saved at `data/bandsintown-raw-response.json` (23 events at capture time), and a cleaned/flattened version matching the fields requested for this task (date, city, region, country, venue, ticket link, RSVP link) is at `data/tour-dates.json`. Both will drift out of date immediately since this is a live feed, treat as a point-in-time reference only.
- The Bandsintown artist record also carries the act's own canonical social links (Spotify, Apple, YouTube, etc.) as a side effect of the API response, worth cross-checking against the footer's manually-maintained social links (see url-inventory.csv note on the YouTube URL mismatch: channel-ID vs. handle).

## Other findings worth flagging

- **Google Ads / conversion tracking**: the site has a `gtag.js` / Google Ads conversion ID (`AW-17574370157`) and a Facebook Pixel (`1858545644702596`) firing on every page. Not part of this extraction's scope, but worth knowing about before assuming there's no existing ad tracking to account for.
- **About page background inconsistency**: confirmed by direct inspection, the "OUR STORY" heading area renders on a near-white background while the photo+body-copy section immediately below it renders on the same near-black background as every other page. This reads as an intentional two-tone section design rather than a broken page, but it's inconsistent with Home/Tour/Music, which are black top-to-bottom. Decide deliberately rather than copying either behavior by default.

## What could not be retrieved, or came back short

- **`album-art-self-titled-remastered-2025.png` only came back at 1000×1000px**, even when explicitly requesting Squarespace's largest tier (`?format=2500w`). This means the master file uploaded to Squarespace itself is capped at 1000×1000, not a request-side limitation. If this cover needs to appear large (e.g. a hero-sized placement) in the rebuild, **this is a client asset request** — ask for the original higher-resolution album art file.
- **Per-service DSP destination URLs on the Feature.fm smart links** are not retrievable as static data, they're resolved by a client-side click handler rather than being present in the page as plain hrefs (see "Links and smart links" above). Not a failure so much as a platform behavior to be aware of if anyone tries to scrape these programmatically later.
- **Shop and Subscribe pages themselves were not archived** as pages, per the task's instructions to record but not archive external-domain destinations. `https://thebandperry.colortestmerch.com/` and `https://beacons.ai/thebandperry/emaillist` are noted in url-inventory.csv with their destination and status only.
- **Bandsintown numeric artist ID (386741) vs. the Facebook page ID (28815296015)** referenced inside the Bandsintown response weren't independently verified beyond what the API returned, no reason to doubt them, just noting they're second-hand (Bandsintown's own data) rather than pulled directly from a Facebook/Meta source.
