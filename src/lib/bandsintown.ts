export type TourDate = {
  id: string;
  datetime: string;
  venueName: string;
  city: string;
  region: string;
  country: string;
  free: boolean;
  ticketUrl?: string;
  rsvpUrl: string;
};

const ARTIST_NAME = "The Band Perry";

// The legacy Squarespace site's Tour Dates block called Bandsintown with this
// exact app_id. Bandsintown's public events API rejects unrecognized app_ids
// (confirmed: a made-up id returns 403 "explicit deny"), so this must stay
// until the client registers their own app_id directly with Bandsintown --
// swap it in via BANDSINTOWN_APP_ID once that happens.
const APP_ID = process.env.BANDSINTOWN_APP_ID || "squarespace-the-band-perry";

type BandsintownEvent = {
  id: string;
  datetime: string;
  title?: string;
  free?: boolean;
  venue?: { name?: string; city?: string; region?: string; country?: string };
  offers?: { type?: string; url?: string }[];
  url?: string;
};

export async function fetchTourDates(): Promise<TourDate[]> {
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(
    ARTIST_NAME
  )}/events?app_id=${encodeURIComponent(APP_ID)}&date=upcoming`;

  let events: BandsintownEvent[];
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    events = data;
  } catch {
    return [];
  }

  return events
    .filter((ev) => ev.datetime)
    .map((ev) => ({
      id: ev.id,
      datetime: ev.datetime,
      venueName: (ev.venue?.name || ev.title || "").trim(),
      city: ev.venue?.city ?? "",
      region: ev.venue?.region ?? "",
      country: ev.venue?.country ?? "",
      free: Boolean(ev.free),
      ticketUrl: ev.offers?.find((o) => o.type === "Tickets")?.url,
      rsvpUrl: ev.url ?? "",
    }))
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
}
