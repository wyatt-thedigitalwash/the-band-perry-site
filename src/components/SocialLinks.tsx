import {
  AmazonIcon,
  AppleMusicIcon,
  FacebookIcon,
  InstagramIcon,
  SpotifyIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons/BrandIcons";

// Exported so the artist's JSON-LD `sameAs` is generated from the same list the
// footer renders, rather than a second copy of the same URLs drifting from it.
export const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/thebandperry", Icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com/thebandperry", Icon: InstagramIcon },
  { name: "X", href: "https://x.com/thebandperry", Icon: XIcon },
  { name: "TikTok", href: "https://tiktok.com/@thebandperry", Icon: TikTokIcon },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/75FnCoo4FBxH5K1Rrx0k5A",
    Icon: SpotifyIcon,
  },
  {
    name: "Apple Music",
    href: "https://music.apple.com/gb/artist/the-band-perry/345752964",
    Icon: AppleMusicIcon,
  },
  {
    name: "Amazon Music",
    href: "https://music.amazon.com/artists/B00G9Y9P70",
    Icon: AmazonIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UC5lp1vncB8eJV11uvrqnniQ",
    Icon: YouTubeIcon,
  },
] as const;

export function SocialLinks() {
  return (
    <ul className="flex items-center gap-4 sm:gap-5">
      {SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <li key={name}>
          {/* py-3.5 / -my-3.5 lifts the tap target to 44px tall while the
              negative margin keeps the footer row exactly as tall as before.
              Horizontal padding is capped at the icon gap so neighbouring
              targets stay adjacent rather than overlapping. */}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} (opens in new tab)`}
            className="-my-3.5 -mx-2 flex items-center px-2 py-3.5 text-[#FAFAFA]/80 transition-colors hover:text-[#AADCF8]"
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
