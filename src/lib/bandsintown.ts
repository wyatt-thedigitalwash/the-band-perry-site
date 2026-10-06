export type TourDate = {
  id: string;
  datetime: string;
  venueName: string;
  city: string;
  region: string;
  country: string;
  free: boolean;
  ticketUrl?: string;
  // True when the only ticket offer is a presale window. Bandsintown swaps the
  // offer type back to "Tickets" once general on-sale opens, so this flips off
  // on its own at the next hourly revalidation.
  presale: boolean;
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

// Bandsintown's offer type is not always "Tickets": it emits "Presale" while an
// artist presale window is open, and "Free" for no-cost shows (fairs, festival
// stages). All three carry the link the Tickets CTA should point at, so accept
// any of them, preferring general on-sale when more than one is present.
const TICKET_OFFER_TYPES = ["Tickets", "Presale", "Free"];

function pickTicketOffer(offers: BandsintownEvent["offers"]) {
  for (const type of TICKET_OFFER_TYPES) {
    const match = offers?.find((o) => o.type === type && o.url);
    if (match) return match;
  }
  return undefined;
}

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
    .map((ev) => {
      const offer = pickTicketOffer(ev.offers);
      return {
        id: ev.id,
        datetime: ev.datetime,
        venueName: (ev.venue?.name || ev.title || "").trim(),
        city: ev.venue?.city ?? "",
        region: ev.venue?.region ?? "",
        country: ev.venue?.country ?? "",
        free: Boolean(ev.free),
        ticketUrl: offer?.url,
        presale: offer?.type === "Presale",
        rsvpUrl: ev.url ?? "",
      };
    })
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
}
