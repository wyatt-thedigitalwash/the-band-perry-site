import Image from "next/image";
import Link from "next/link";
import { kurilian } from "@/lib/fonts";

/**
 * Persistent site header for the content / policy pages. The home page is a
 * full-screen splash with its own centered logo + nav, so once a visitor
 * leaves it this header carries the same centered, stacked treatment (wordmark
 * over a centered nav row) rather than a generic left/right bar. Fixed to the
 * top with no solid bar of its own so the page's textured background reads
 * straight through; a soft top-down scrim keeps the wordmark and links legible
 * and fades out before the content starts. The consuming pages reserve ~9rem of
 * top padding to clear it.
 */

const NAV_LINKS = [
  { label: "Tour", href: "/tour", external: false },
  { label: "Shop", href: "https://thebandperry.colortestmerch.com/", external: true },
  { label: "Music", href: "/music", external: false },
  { label: "Videos", href: "/videos", external: false },
  { label: "Band", href: "/band", external: false },
  { label: "Subscribe", href: "https://beacons.ai/thebandperry/emaillist", external: true },
] as const;

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[160px] bg-gradient-to-b from-black/75 via-black/40 to-transparent sm:h-[190px]"
      />

      <div className="pointer-events-auto relative mx-auto flex flex-col items-center gap-2.5 px-5 py-4 sm:gap-3">
        <Link href="/" aria-label="The Band Perry home" className="shrink-0">
          <Image
            src="/images/logo-horizontal-wordmark-blue-textured.png"
            alt="The Band Perry"
            width={2326}
            height={583}
            priority
            // Only a blue-textured wordmark asset exists. Desaturating and
            // lifting it renders the header lockup in off-white while keeping
            // the distressed texture, rather than flattening it to a solid
            // silhouette the way brightness(0) + invert(1) would.
            className="h-10 w-auto saturate-0 brightness-[1.35] sm:h-12"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className={`${kurilian.className} flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 sm:gap-x-8`}
        >
          {NAV_LINKS.map(({ label, href, external }) => {
            // Padding grows the tap target to 44px tall and ~56px wide; the
            // matching negative margins hand that space back to the row, so
            // the nav renders exactly where it did before. The horizontal pad
            // stays under the 20px gap so neighbouring targets never overlap.
            const className =
              "-my-3 -mx-2 px-2 py-3 text-[13px] uppercase tracking-[0.2em] text-[#FAFAFA] transition-colors duration-200 hover:text-[#aadcf8] sm:text-sm";

            // Internal destinations must route through next/link. A plain <a>
            // triggers a full document load, which tears down and rebuilds this
            // header on every click -- the wordmark visibly flashes as the new
            // document paints. External links stay plain anchors.
            return external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <Link key={label} href={href} className={className}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
