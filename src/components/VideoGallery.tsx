"use client";

import { useState } from "react";
import Image from "next/image";
import { kurilian } from "@/lib/fonts";
import { VIDEOS, videoThumb, type Video } from "@/lib/videos";
import { VideoLightbox } from "@/components/VideoLightbox";

/**
 * The Videos page body: the newest release gets a full-width cinematic
 * spotlight, then the rest of the catalog runs newest to oldest, grouped under
 * large year markers like chapters. Every card opens the VideoLightbox rather
 * than leaving the site for YouTube.
 */

function PlayGlyph({ large = false }: { large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full border border-[#fafafa]/60 bg-black/40 backdrop-blur-[2px] transition-all duration-300 group-hover:border-[#aadcf8] group-hover:bg-black/60 ${
        large ? "h-20 w-20 md:h-24 md:w-24" : "h-14 w-14"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`translate-x-[2px] text-[#fafafa] transition-colors duration-300 group-hover:text-[#aadcf8] ${
          large ? "h-8 w-8 md:h-10 md:w-10" : "h-6 w-6"
        }`}
      >
        <path d="M8 5.5v13l11-6.5-11-6.5z" />
      </svg>
    </span>
  );
}

function FeaturedVideo({
  video,
  onPlay,
}: {
  video: Video;
  onPlay: (video: Video) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-video w-full overflow-hidden border border-[#fafafa]/15">
        <Image
          src={videoThumb(video.youtubeId)}
          alt={`${video.title} official music video still`}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* Bottom scrim keeps the overlaid title legible on any frame. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayGlyph large />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-center md:p-8">
          {/* The spotlight title is a real heading, not decorative type: it
              names the featured video the same way the year markers below name
              their groups. `block` is kept so the tag swap is invisible. */}
          <h2
            className={`${kurilian.className} block text-[26px] uppercase leading-tight tracking-[0.12em] text-[#fafafa] md:text-[40px]`}
          >
            {video.title}
          </h2>
          {video.featuring ? (
            <span className="mt-1 block text-sm text-[#fafafa]/80">
              {video.featuring}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function VideoCard({
  video,
  onPlay,
}: {
  video: Video;
  onPlay: (video: Video) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-video w-full overflow-hidden border border-[#fafafa]/10">
        <Image
          src={videoThumb(video.youtubeId)}
          alt={`${video.title} official music video still`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <PlayGlyph />
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3
          className={`${kurilian.className} text-[18px] uppercase leading-tight tracking-[0.12em] text-[#fafafa] md:text-[20px]`}
        >
          {video.title}
        </h3>
        {video.featuring ? (
          <p className="mt-1 text-xs text-[#fafafa]/70">{video.featuring}</p>
        ) : null}
      </div>
    </button>
  );
}

export function VideoGallery() {
  const [active, setActive] = useState<Video | null>(null);

  // Newest release leads as the spotlight; the rest run in the year chapters.
  const [featured, ...catalog] = VIDEOS;
  const years = [...new Set(catalog.map((video) => video.year))];

  return (
    <div className="mx-auto max-w-[1100px]">
      <FeaturedVideo video={featured} onPlay={setActive} />

      <div className="mt-16 flex flex-col gap-14 md:mt-20 md:gap-16">
        {years.map((year) => (
          <section key={year} aria-label={`${year} videos`}>
            <h2
              className={`${kurilian.className} mb-7 text-[30px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[38px]`}
            >
              {year}
            </h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {catalog
                .filter((video) => video.year === year)
                .map((video) => (
                  <VideoCard
                    key={video.youtubeId}
                    video={video}
                    onPlay={setActive}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {active ? (
        <VideoLightbox video={active} onClose={() => setActive(null)} />
      ) : null}
    </div>
  );
}
