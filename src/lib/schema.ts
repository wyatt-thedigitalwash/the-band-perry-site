import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import { SOCIAL_LINKS } from "@/components/SocialLinks";
import { RELEASES } from "@/lib/releases";
import { VIDEOS, videoThumb } from "@/lib/videos";
import type { TourDate } from "@/lib/bandsintown";

/**
 * schema.org builders.
 *
 * The subject of this site is a touring recording artist, not a business with a
 * storefront, so the root entity is a MusicGroup rather than a LocalBusiness --
 * SITE.md lists no address, phone, hours or service area, and LocalBusiness
 * requires exactly the fields that do not exist here. Every page carries the
 * MusicGroup + WebSite pair; the content pages add the structured data that
 * matches what they actually list (events, releases, videos).
 *
 * Nothing here is invented: every value traces to SITE.md, /lib data, or the
 * page's own copy.
 */

const ARTIST_ID = `${SITE_URL}/#artist`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const ARTIST_DESCRIPTION =
  "The Band Perry is a GRAMMY, CMA, and ACM Award-winning country band known for their genre-defying Appalachian gothic sound and the 9x Platinum single If I Die Young.";

/** Reference to the MusicGroup node, for use inside other nodes. */
const artistRef = { "@id": ARTIST_ID } as const;

function musicGroup() {
  return {
    "@type": "MusicGroup",
    "@id": ARTIST_ID,
    name: SITE_NAME,
    description: ARTIST_DESCRIPTION,
    url: SITE_URL,
    image: absoluteUrl("/og-image.png"),
    logo: absoluteUrl("/images/logo-horizontal-wordmark-blue-textured.png"),
    genre: ["Country", "Americana"],
    // Every profile the footer links to, which is how search engines reconcile
    // this entity with the artist's DSP and social presences.
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-US",
    publisher: artistRef,
  };
}

/** The site-wide graph, rendered once in the root layout on every page. */
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [musicGroup(), website()],
  };
}

/**
 * Home > [Parent] > [Page]. The home crumb is always position 1; pass the trail
 * below it, e.g. [{ name: "Legal & Policies", path: "/legal" }, { name: "Terms
 * & Conditions", path: "/legal/terms" }].
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const crumbs = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Upcoming shows on /tour, from the live Bandsintown feed. */
export function tourEventsSchema(dates: TourDate[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} tour dates`,
    itemListElement: dates.map((date, i) => {
      const location = {
        "@type": "Place",
        name: date.venueName,
        address: {
          "@type": "PostalAddress",
          ...(date.city ? { addressLocality: date.city } : {}),
          ...(date.region ? { addressRegion: date.region } : {}),
          ...(date.country ? { addressCountry: date.country } : {}),
        },
      };

      const ticketUrl = date.ticketUrl ?? date.rsvpUrl;

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MusicEvent",
          name: `${SITE_NAME} at ${date.venueName}`,
          // Bandsintown datetimes carry no offset -- they are the venue's local
          // wall-clock time, which is exactly what schema.org expects here.
          startDate: date.datetime,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location,
          performer: artistRef,
          ...(date.rsvpUrl ? { url: date.rsvpUrl } : {}),
          ...(ticketUrl
            ? {
                offers: {
                  "@type": "Offer",
                  url: ticketUrl,
                  availability: "https://schema.org/InStock",
                  // Only free shows have a price we actually know.
                  ...(date.free ? { price: "0", priceCurrency: "USD" } : {}),
                },
              }
            : {}),
        },
      };
    }),
  };
}

/** The release grid on /music. Each card links out to a Feature.fm smart link. */
export function musicReleasesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} music`,
    itemListElement: RELEASES.map((release, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicRecording",
        name: release.title,
        byArtist: artistRef,
        image: absoluteUrl(release.art),
        url: release.href,
        datePublished: release.year,
      },
    })),
  };
}

/** The official music videos on /videos, played in-page via the lightbox. */
export function videosSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} official music videos`,
    itemListElement: VIDEOS.map((video, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: `${video.title}${video.featuring ? ` ${video.featuring}` : ""}`,
        description: `Official music video for ${video.title} by ${SITE_NAME}.`,
        thumbnailUrl: videoThumb(video.youtubeId),
        uploadDate: video.released,
        embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
        url: absoluteUrl("/videos"),
      },
    })),
  };
}
