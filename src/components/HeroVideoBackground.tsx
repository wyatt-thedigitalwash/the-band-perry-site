"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_SRC =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1785091024/TheBandPerry_Hero_step6x.mp4";
const MOBILE_SRC =
  "https://res.cloudinary.com/dgbiatexy/video/upload/v1785091021/TheBandPerry_HeroMobile_ewkx3m.mp4";

// Mobile-breakpoint match keeps the swap in CSS via <source media>, no client JS needed for source selection.
const MOBILE_BREAKPOINT = "(max-width: 767px)";

export function HeroVideoBackground() {
  // No poster image: the container is solid black and the video fades in from
  // it once its first frame is ready. This drops a ~7MB poster PNG that was
  // loading with priority and competing with the video for bandwidth.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The video can reach its first frame BEFORE React hydrates and attaches the
    // onLoadedData handler below (fast/cached load between SSR and hydration). In
    // that case the event is missed and the video would stay hidden (opacity 0)
    // until a manual reload -- exactly the "only shows after reload" symptom.
    // Checking readyState on mount catches that already-loaded case, and calling
    // play() nudges browsers that deferred autoplay until user-agent JS ran.
    if (v.readyState >= 2) setVideoReady(true);
    v.play?.().catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
      >
        <source media={MOBILE_BREAKPOINT} src={MOBILE_SRC} type="video/mp4" />
        <source src={DESKTOP_SRC} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
