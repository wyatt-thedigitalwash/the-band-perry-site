"use client";

import Link from "next/link";
import { useState } from "react";
import SubscribeModal from "@/components/SubscribeModal";
import { kurilian } from "@/lib/fonts";

const NAV_BUTTONS = [
  { label: "Tour", href: "/tour", external: false },
  { label: "Shop", href: "https://thebandperry.colortestmerch.com/", external: true },
  { label: "Music", href: "/music", external: false },
  { label: "About", href: "/about", external: false },
] as const;

const buttonClass = `corner-inverted ${kurilian.className} px-5 py-1 text-[18px] uppercase tracking-[0.2em] text-[#FAFAFA] transition-colors duration-200 hover:text-white sm:px-6`;

export function HeroNavButtons() {
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  return (
    <>
      <nav aria-label="Primary" className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
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
