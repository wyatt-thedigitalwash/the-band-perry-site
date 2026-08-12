"use client";

import { useEffect, useRef } from "react";
import { kurilian } from "@/lib/fonts";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type { Video } from "@/lib/videos";

/**
 * Full-screen player overlay for the Videos page. Near-black backdrop with the
 * video centered at a cinematic width; playback starts immediately via the
 * privacy-enhanced youtube-nocookie embed. Closes on Escape, backdrop click,
 * or the X button, and locks page scroll while open.
 */
export function VideoLightbox({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Tab stays on the close button and the YouTube frame; focus returns to the
  // video card that opened the player.
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Now playing: ${video.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-[#fafafa]/70 transition-colors duration-200 hover:text-[#aadcf8] sm:right-6 sm:top-6"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>

      {/* Stop propagation so clicks on the player itself don't close the modal. */}
      <div
        className="w-full max-w-[1100px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="aspect-video w-full overflow-hidden border border-[#fafafa]/15 bg-black shadow-[0_0_80px_rgba(170,220,248,0.08)]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={`${video.title} official music video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        <div className="mt-5 text-center">
          <p
            className={`${kurilian.className} text-[20px] uppercase leading-tight tracking-[0.12em] text-[#fafafa] md:text-[24px]`}
          >
            {video.title}
          </p>
          {video.featuring ? (
            <p className="mt-1 text-sm text-[#fafafa]/70">{video.featuring}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
