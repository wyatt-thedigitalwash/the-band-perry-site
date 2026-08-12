import type { TourDate } from "@/lib/bandsintown";
import { kurilian } from "@/lib/fonts";

/**
 * A single tour date, styled as a show-poster line: the gothic display face
 * (kurilian) carries the date and venue, Geist carries the small uppercase meta
 * line, and the CTAs reuse the site's accent-outline treatment that fills to
 * #AADCF8 with #292929 text on hover (the palette's button pairing from
 * SITE.md). Rows previously carried no font class at all, so they inherited the
 * body element's Arial fallback and read as unbranded next to the rest of the
 * site.
 */

// Asymmetric horizontal padding: letter-spacing is applied after every glyph
// including the last, so equal padding leaves the label visually shifted left
// inside the box. The right pad sheds exactly one tracking step to re-centre it.
// The button is 31px tall by design. `after:-inset-y-2` extends only the hit
// area to 47px -- it paints nothing, so the filled pill keeps its exact size,
// and staying vertical means the Tickets/RSVP pair never overlaps.
const ctaClass = `${kurilian.className} relative border border-[#aadcf8] bg-[#aadcf8] py-1.5 pl-5 pr-[calc(1.25rem-0.2em)] text-[11px] uppercase tracking-[0.2em] text-[#292929] transition-colors duration-200 hover:bg-transparent hover:text-[#aadcf8] after:absolute after:-inset-y-2 after:inset-x-0 after:content-['']`;

/**
 * Rule between tour rows: a single hairline that fades to transparent at both
 * edges, in place of the old hard edge-to-edge border. Rendered as its own
 * list item between date rows.
 */
export function TourDivider() {
  return (
    <li aria-hidden="true" className="px-1 sm:px-2">
      <span className="block h-px w-full bg-gradient-to-r from-transparent via-[#aadcf8]/30 to-transparent" />
    </li>
  );
}

export function TourDateRow({ date }: { date: TourDate }) {
  // Bandsintown's datetime string ("2026-08-13T19:30:00") has no timezone
  // designator, so it's already the venue's local wall-clock time. Appending
  // "Z" forces the Date to parse those exact digits as UTC instead of the
  // server's own local time -- combined with `timeZone: "UTC"` below, that
  // echoes the venue's local time back unchanged no matter where this runs.
  // Without it, the display time shifts by the server's own UTC offset.
  const d = new Date(`${date.datetime}Z`);
  const month = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  const day = d.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" });
  const weekday = d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).toUpperCase();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

  const location = [date.city, date.region, date.country].filter(Boolean).join(", ");

  return (
    // The hover wash is a ::before overlay that fades to transparent at both
    // horizontal edges, echoing the fading dividers, instead of a hard-edged
    // full-width fill.
    <li className="group relative isolate before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-transparent before:via-[#aadcf8]/[0.06] before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
      <div className="flex flex-col gap-5 px-1 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-2">
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Date stack. Fixed width keeps the venue column aligned across rows
              (and the mobile CTA indent below assumes 74px + 20px gap). */}
          <div className={`${kurilian.className} w-[74px] shrink-0 text-center`}>
            {/* -mr compensates for the trailing letter-space so the tracked
                labels sit optically centred over the day numeral, which has
                none. */}
            <div className="-mr-[0.25em] text-[11px] uppercase leading-none tracking-[0.25em] text-[#aadcf8]">
              {month}
            </div>
            <div className="mt-1.5 text-[32px] leading-none text-[#fafafa]">{day}</div>
            {/* /45 measured 4.24:1 on black, under the 4.5:1 floor for text
                this size. /50 clears it at 5.10:1. */}
            <div className="-mr-[0.25em] mt-2 text-[10px] uppercase leading-none tracking-[0.25em] text-[#fafafa]/50">
              {weekday}
            </div>
          </div>

          <div className="min-w-0">
            {/* Each show is a top-level item under the page's "Tour" h1, so the
                venue name is an h2. Tag only -- the type scale is unchanged. */}
            <h2
              className={`${kurilian.className} text-[17px] uppercase leading-snug tracking-[0.12em] text-[#fafafa] sm:text-[19px]`}
            >
              {date.venueName}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-[11px] uppercase text-[#fafafa]/55">
              {location ? <span>{location}</span> : null}
              {location ? (
                <span aria-hidden className="text-[#aadcf8]/40">
                  /
                </span>
              ) : null}
              <span>{time}</span>
            </p>
          </div>
        </div>

        {/* Stacked below on mobile, indented to line up with the venue name:
            74px date column + 20px (gap-5) = 94px. */}
        {/* "Tickets" / "RSVP" repeat down the whole list, so each link's
            accessible name names the show it belongs to. */}
        <div className="flex shrink-0 items-center gap-3 pl-[94px] sm:pl-0">
          {date.ticketUrl ? (
            <a
              href={date.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${date.free ? "Free entry" : "Tickets"} for ${date.venueName}${
                location ? `, ${location}` : ""
              } (opens in new tab)`}
              className={ctaClass}
            >
              {date.free ? "Free" : "Tickets"}
            </a>
          ) : null}
          {date.rsvpUrl ? (
            <a
              href={date.rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`RSVP for ${date.venueName}${
                location ? `, ${location}` : ""
              } (opens in new tab)`}
              className={ctaClass}
            >
              RSVP
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
