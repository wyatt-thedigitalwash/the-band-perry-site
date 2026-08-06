"use client";

import Link from "next/link";
import { useState } from "react";
import SubscribeModal from "@/components/SubscribeModal";
import { kurilian } from "@/lib/fonts";

const NAV_BUTTONS = [
  { label: "Tour", href: "/tour", external: false },
  { label: "Shop", href: "https://thebandperry.colortestmerch.com/", external: true },
  { label: "Music", href: "/music", external: false },
  { label: "Videos", href: "/videos", external: false },
  { label: "About", href: "/about", external: false },
] as const;

// On mobile the buttons sit in a fixed 3x2 grid (see the nav element), so every
// cell is the same width and the notched corners of neighboring buttons align
// around the gaps to form the full circle motif. Width comes from the grid
// there, so mobile keeps horizontal padding minimal; sm+ returns to a single
// centered row of intrinsic-width buttons.
// Mobile tracking is slightly tighter than desktop so "Subscribe", the longest
// label, fits a one-third column on a 390px phone (measured: 15px kurilian at
// 0.125em tracking is ~79px vs ~82px of usable width inside the 12px frame).
const buttonClass = `corner-inverted ${kurilian.className} whitespace-nowrap px-0 py-0.5 text-center text-[15px] uppercase tracking-[0.125em] text-[#FAFAFA] transition-colors duration-200 hover:text-white sm:px-6 sm:py-1 sm:text-[16px] sm:tracking-[0.2em]`;

export function HeroNavButtons() {
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className="grid w-full max-w-[420px] grid-cols-3 gap-3 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
      >
        {/* Internal destinations route through next/link so leaving the splash
            is a client-side transition rather than a full document load.
            External links stay plain anchors. */}
        {NAV_BUTTONS.map(({ label, href, external }) =>
          external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              {label}
            </a>
          ) : (
            <Link key={label} href={href} className={buttonClass}>
              {label}
            </Link>
          )
        )}
        <button type="button" onClick={() => setSubscribeOpen(true)} className={buttonClass}>
          Subscribe
        </button>
      </nav>

      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </>
  );
}
