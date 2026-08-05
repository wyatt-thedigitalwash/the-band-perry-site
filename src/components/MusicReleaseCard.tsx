import Image from "next/image";
import type { Release } from "@/lib/releases";
import { kurilian } from "@/lib/fonts";

/**
 * A single release card for the Music grid. The whole card is one external link
 * to the release's Feature.fm smart link (opens a new tab): cover art on top
 * with a subtle zoom on hover, then title / year / CTA label beneath.
 */
export function MusicReleaseCard({ release }: { release: Release }) {
  return (
    <a
      href={release.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-square w-full overflow-hidden border border-[#fafafa]/10">
        <Image
          src={release.art}
          alt={release.artAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 text-center">
        <h2 className={`${kurilian.className} text-[20px] uppercase leading-tight tracking-[0.12em] text-[#fafafa] md:text-[22px]`}>
          {release.title}
        </h2>
        <p className="mt-1 text-xs text-[#fafafa]/50">({release.year})</p>
        <span className="mt-2 inline-block text-[11px] uppercase tracking-[0.25em] text-[#aadcf8] transition-opacity duration-200 group-hover:opacity-70">
          {release.cta}
        </span>
      </div>
    </a>
  );
}
