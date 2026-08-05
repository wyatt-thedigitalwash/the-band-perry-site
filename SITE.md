# the-band-perry Website Reference

## Business Info
- Business Name: The Band Perry
- Industry: Music / Recording Artist (Country duo)
- Location: TBD (touring nationally/internationally, no fixed storefront)
- Phone: N/A
- Email: TBD (confirm with client — not published on current site)
- Website URL: https://bandperry.com/
- Google Business Profile: N/A (not applicable to a touring artist)

## Positioning
The Band Perry is a GRAMMY, CMA, and ACM Award-winning country duo led by Kimberly Perry, known for genre-defying, "Appalachian gothic" storytelling and a bold 2025 return after hiatus. The site serves existing fans and new listeners who want tour dates, new music, and merch, and it needs to read as an established, decade-plus act (2.5M albums sold, 12M singles, 1B+ streams) relaunching into a new era, not a legacy nostalgia act.

## Brand Voice
- Gothic-Americana, cinematic, a little dramatic — leans into "Appalachian gothic" imagery (lace, bone, bows, Southern tradition) rather than upbeat pop-country cheerfulness.
- Confident about accomplishments (awards, sales, streams) but not corporate-sounding — copy reads like storytelling, not a press release bullet list.
- No em dashes in any user-facing copy (per CLAUDE.md) — use commas, periods, or two hyphens instead. The current live About copy has one em dash that must be rewritten when ported over.
- Uppercase display type is part of the voice (section headers, nav) — treat as a design convention, not necessarily an implication for sentence casing.

## Visual Direction
- Reference points: the current live site's own "Appalachian gothic" direction — think distressed Western gothic show posters, Victorian mourning/lace imagery (the lace-heart motif), blackletter/old-timey display lettering against near-black backgrounds.
- Adjacent brand touchpoints: dark alt-country/gothic-Americana visual worlds (think Wednesday-esque Southern gothic, distressed band-merch graphics) rather than glossy mainstream Nashville country branding.
- Anti-patterns to avoid: bright/cheerful pop-country palettes (sunny yellows, primary colors), clean corporate sans-serif everywhere, stock-photo-style polish that undercuts the gothic/handmade feel.

## Colors
- Background: `#000000` (near-black; primary background for Home/Tour/Music/footer)
- Primary Text: `#FAFAFA` (off-white body copy on dark sections)
- Accent: `#AADCF8` (pale sky blue — logo, headings, active nav state, button fill)
- Secondary Accent: `#292929` (dark charcoal — button text on the blue accent buttons)
- Note: the live About page currently renders on a near-white background instead of black — flagged as an inconsistency to resolve (pick one system) rather than a pattern to replicate.

## Typography
- Display Font: Custom gothic/blackletter-style display faces (live site computes as `kurilian` for headings/logo/nav-link text and `inkfolk` for nav container) — need to confirm licensing/source before reuse; uppercase with wide letter-spacing (H1 ≈ 91px / ~3.7px tracking on desktop).
- Body Font: Space Grotesk (Google Fonts, free) — currently used for buttons/UI; can extend to body copy for consistency.
- Sizing scale: Hero/H1 ~90px desktop uppercase display; section headers (e.g. "TOUR", "MUSIC") similarly large uppercase display; body paragraphs standard readable size (~16-18px), nav links ~19px small-caps style.

## Logo
Two lockups on the current site, both with a distressed/textured blue treatment on transparent backgrounds:
- Full horizontal wordmark ("The Band Perry" in the gothic display face) — primary logo, used in header on every page.
- Abbreviated monogram/badge mark — used as a compact alternate mark.
Current files live on Squarespace's CDN only; need to be downloaded and re-hosted under `/public` (e.g. `/public/logo/`) for the rebuild. Confirm final vector/high-res source files with the client before launch.

## Pages
- [ ] Home
- [ ] Tour
- [ ] Music
- [ ] About
- [ ] Shop (decide: external link-out to merch storefront vs. native integration)
- [ ] Subscribe (decide: embed native form vs. link out to email list provider)

## CTAs
- Primary: Tickets / RSVP (tour dates), Listen / Pre-Save (music releases)
- Secondary: Subscribe to Email

## Content Status

### Text Content
- [ ] Business bio / artist bio: draft available from current live site's "Our Story" copy — needs one em dash rewritten, otherwise usable
- [ ] Service descriptions: N/A (not a service business)
- [ ] Testimonials: none present on current site
- [ ] About page copy: present (see above), final copy TBD with client
- [ ] Contact form auto-reply: N/A unless a contact page is added

### Visual Content
- [ ] Logo files (final version in /public): not yet migrated — currently Squarespace-hosted only
- [ ] Artist/press photos: hero photo available from current site; confirm rights/ownership before reuse
- [ ] Gallery/tour photos: none beyond hero and album art currently
- [ ] Album/single artwork: 7 covers identified on current Music page, need final hi-res files
- [ ] OG image: current site uses a hero photo crop; decide auto-generated vs. custom for rebuild

### Business Info Confirmed
- [ ] Address confirmed: N/A (no physical location)
- [ ] Phone number confirmed: N/A
- [ ] Email confirmed: not yet — no contact email published on current site
- [ ] Hours confirmed: N/A
- [ ] Social profiles confirmed: yes — TikTok, Instagram, X, YouTube, Facebook, Spotify, Apple Music (handles captured from live site)

### Integrations
- [ ] Resend domain verified: not yet set up
- [ ] Google Analytics installed: not confirmed on current site
- [ ] Google Search Console verified: not confirmed
- [ ] Google Business Profile linked: N/A
- [ ] Tour dates source: current site uses Squarespace's native Tour Dates block via Bandsintown — decide whether rebuild keeps a live feed or hardcodes a maintained dates array
- [ ] Music smart links: current site routes all "Listen" CTAs through Feature.fm (`ffm.to`) rather than direct DSP links — confirm whether to keep

### Blocking Items for Launch
- Decide Tour data source (live Bandsintown feed vs. self-managed dates)
- Decide Shop approach (external link to `colortestmerch.com` vs. native commerce)
- Decide Subscribe approach (external `beacons.ai` link vs. native form + Resend)
- Source licensed/legit files for the gothic display fonts (`kurilian` / `inkfolk`) or choose an approved substitute
- Resolve About page background inconsistency (light vs. dark)
- Confirm rights to reuse existing hero photo and album artwork

### Nice-to-Have (Post-Launch)
- Native commerce integration for Shop (if launching with an external link first)
- Native email capture + Resend automation (if launching with beacons.ai first)
- Expanded, unique SEO meta descriptions for Tour/Music/About (current live copies are thin boilerplate)

## Notes
- Current live site (bandperry.com) is built on Squarespace; this rebuild replaces it entirely with the Next.js stack described in CLAUDE.md.
- Full extraction/audit of the current live site (content, design tokens, asset URLs, tour dates snapshot) is saved as an Artifact from the 2026-07-26 session for reference during build-out.
- Recurring visual motifs worth preserving: notched/frame border treatment around hero photography, lace-heart divider graphic, distressed-texture logo treatment.
