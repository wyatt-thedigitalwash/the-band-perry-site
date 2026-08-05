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
const ctaClass = `${kurilian.className} border border-[#aadcf8] bg-[#aadcf8] py-1.5 pl-5 pr-[calc(1.25rem-0.2em)] text-[11px] uppercase tracking-[0.2em] text-[#292929] transition-colors duration-200 hover:bg-transparent hover:text-[#aadcf8]`;

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
    <li className="group border-b border-[#aadcf8]/15 transition-colors duration-200 hover:bg-[#aadcf8]/[0.04]">
      <div className="flex flex-col gap-5 px-1 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-2">
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Date stack, ruled off from the venue the way a poster's date column is */}
          <div
            className={`${kurilian.className} w-[74px] shrink-0 border-r border-[#aadcf8]/20 pr-5 text-center`}
          >
            {/* -mr compensates for the trailing letter-space so the tracked
                labels sit optically centred over the day numeral, which has
                none. */}
            <div className="-mr-[0.25em] text-[11px] uppercase leading-none tracking-[0.25em] text-[#aadcf8]">
              {month}
            </div>
            <div className="mt-1.5 text-[32px] leading-none text-[#fafafa]">{day}</div>
            <div className="-mr-[0.25em] mt-2 text-[10px] uppercase leading-none tracking-[0.25em] text-[#fafafa]/45">
              {weekday}
            </div>
          </div>

          <div className="min-w-0">
            <h3
              className={`${kurilian.className} text-[17px] uppercase leading-snug tracking-[0.12em] text-[#fafafa] sm:text-[19px]`}
            >
              {date.venueName}
            </h3>
            <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-[11px] uppercase tracking-[0.18em] text-[#fafafa]/55">
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
        <div className="flex shrink-0 items-center gap-3 pl-[94px] sm:pl-0">
          {date.ticketUrl ? (
            <a href={date.ticketUrl} target="_blank" rel="noopener noreferrer" className={ctaClass}>
              {date.free ? "Free" : "Tickets"}
            </a>
          ) : null}
          {date.rsvpUrl ? (
            <a href={date.rsvpUrl} target="_blank" rel="noopener noreferrer" className={ctaClass}>
              RSVP
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
