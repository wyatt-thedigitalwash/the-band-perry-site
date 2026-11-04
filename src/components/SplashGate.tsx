"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CHRISTMAS, SPLASH_STORAGE_KEY } from "@/lib/christmas";
import { useSplashEntered } from "@/components/consent/useSplashEntered";
import { useFocusTrap } from "@/lib/use-focus-trap";

/**
 * Full-screen release gate shown once per session before a visitor reaches the
 * site, announcing the "A Very Band Perry Christmas" EP.
 *
 * Mounted in the root layout, not on a single page, so it gates every entry
 * point -- a fan arriving on /tour from a search result meets it too. The one
 * exception is /legal, which is never gated: see the exemption below.
 *
 * Visibility is CSS, driven by two classes on <html>, rather than React state:
 *
 *   splash-entered -- took an explicit entry action, or already did this
 *                     session (stamped by the pre-paint script in the layout).
 *   splash-exempt  -- on a /legal route, where the overlay is hidden but no
 *                     entry action has been taken.
 *
 * Doing it this way is what lets the layout's blocking script hide the overlay
 * before the first frame, so a visitor who already entered never sees it flash.
 * It also gives CookieConsent and TermsGate something observable to wait on
 * (useSplashEntered), which is what keeps three prompts from stacking.
 *
 * The overlay therefore stays mounted and is hidden with `display: none`, which
 * also takes it out of the accessibility tree on the pages it is not gating.
 */

// Matches the #splash-overlay opacity transition in globals.css.
const FADE_MS = 450;

// The key art's own shadow tone, measured from the campaign comps, so the
// photo's edges dissolve into the page rather than sitting on a black panel.
const PAPER = "#181818";

export default function SplashGate() {
  const pathname = usePathname();
  const entered = useSplashEntered();
  const panelRef = useRef<HTMLDivElement>(null);

  const exempt = pathname.startsWith("/legal");
  const visible = !entered && !exempt;

  // The pre-paint script in the root layout handles the first paint. This
  // handles client-side navigation, e.g. following the Terms link on the splash
  // itself. Someone who deep-links to a legal page is exempt but NOT marked as
  // entered, so reading the Terms is never treated as agreeing to them.
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("splash-entered")) return;
    root.classList.toggle("splash-exempt", exempt);
  }, [exempt]);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(
        SPLASH_STORAGE_KEY,
        new Date().toISOString(),
      );
    } catch {
      /* private mode throws -- enter regardless */
    }

    const root = document.documentElement;
    const overlay = document.getElementById("splash-overlay");
    if (
      !overlay ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.classList.add("splash-entered");
      return;
    }
    // Fade first, then hide. Adding the class straight away would hard-cut
    // instead of dissolving, because `display: none` cannot be transitioned.
    overlay.classList.add("is-exiting");
    window.setTimeout(() => root.classList.add("splash-entered"), FADE_MS);
  }, []);

  // Tab stays inside the gate while it covers the page.
  useFocusTrap(panelRef, visible);

  // Escape enters the site.
  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  return (
    <div
      id="splash-overlay"
      // One portrait photo serves every width. Below lg it sits at the top of
      // the screen at its natural proportions and fades out into the paper
      // tone, with the lockup and copy stacked beneath it. At lg the layout
      // becomes a split: the photo anchors the right side and its left edge
      // dissolves into the paper, which carries the lockup and copy.
      className="fixed inset-0 z-[80] overflow-hidden bg-[#181818]"
      role="dialog"
      aria-modal="true"
      aria-label={`${CHRISTMAS.title}, the new EP from The Band Perry`}
    >
      {/* Below md the photo is sized by its own aspect ratio so the whole frame
          (tree, couple, stone wall) shows the way it does in the campaign
          comp, with the copy stack filling the room below it. From md the
          taller tablet viewport can take a full-bleed cover crop instead, and
          at lg it narrows to the right 64% of the screen, cropped from the
          top so the couple stay in frame. */}
      <div className="absolute inset-x-0 top-0 aspect-[1434/1920] md:inset-0 md:aspect-auto lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[64%]">
        <Image
          src={CHRISTMAS.photo.src}
          alt={CHRISTMAS.photo.alt}
          fill
          sizes="(min-width: 1024px) 64vw, 100vw"
          priority
          className="object-cover object-top"
        />

        {/* Fades, split by breakpoint: the bottom of the photo dissolves into
            the paper below lg (the copy stack rises out of it), and its left
            edge does the same at lg so there is no hard seam where the photo
            meets the page. The desktop one also darkens the lower third a
            touch so the stone wall does not outshine the copy. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[58%] lg:hidden"
          style={{
            backgroundImage: `linear-gradient(to top, ${PAPER} 0%, ${PAPER} 12%, rgba(24,24,24,0.82) 42%, rgba(24,24,24,0) 100%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-[48%] lg:block"
          style={{
            backgroundImage: `linear-gradient(to right, ${PAPER} 0%, ${PAPER} 10%, rgba(24,24,24,0.72) 45%, rgba(24,24,24,0) 100%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-[36%] lg:block"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(24,24,24,0.7) 0%, rgba(24,24,24,0) 100%)`,
          }}
        />
      </div>

      {/* The copy stack: lockup, date, sub-head, the two actions, and the
          arbitration notice, centred on the lockup at every width. Pinned to
          the bottom below lg so it rises out of the photo's fade; at lg it is
          the left column, vertically centred. */}
      <div
        ref={panelRef}
        className="splash-rise absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-6 text-center sm:pb-8 lg:inset-y-0 lg:right-auto lg:w-[50%] lg:justify-center lg:px-14 lg:pb-0 xl:px-16"
      >
        {/* The lockup is the EP's title, but as a <p>, not a heading: this
            overlay renders on every route, and an h2 announcing an EP would
            land in the middle of the heading outline of /tour, /music and
            every legal page. The image's alt carries the title. */}
        <p className="w-[min(86vw,440px)] sm:w-[min(80vw,520px)] lg:w-full lg:max-w-[600px] xl:max-w-[680px]">
          <Image
            src={CHRISTMAS.lockup.src}
            alt={CHRISTMAS.lockup.alt}
            width={CHRISTMAS.lockup.width}
            height={CHRISTMAS.lockup.height}
            priority
            sizes="(min-width: 1280px) 680px, (min-width: 1024px) 600px, (min-width: 640px) 520px, 86vw"
            className="h-auto w-full"
          />
        </p>

        {/* Date on top, sub-head beneath, both in the toolkit's sub-head face.
            `lining-nums` keeps the 6 at cap height rather than letting an
            old-style figure drop below the baseline. */}
        <p className="font-benton mt-2 text-[#CBB699] lining-nums sm:mt-3 lg:-mt-1">
          <time
            dateTime={CHRISTMAS.releaseDate}
            className="block text-[34px] font-bold italic leading-none tracking-[-0.01em] sm:text-[40px] lg:text-[42px] xl:text-[50px]"
          >
            {CHRISTMAS.releaseLabel}
          </time>
          <span className="mt-2 block text-[13px] font-bold uppercase leading-none tracking-[0.1em] sm:text-[15px] lg:mt-2.5 lg:text-[15px] xl:text-[17px]">
            {CHRISTMAS.subhead}
          </span>
        </p>

        {/* Two full-width actions, stacked on phones and side by side from sm.
            Tall enough to be the obvious next step under the announcement. */}
        <div className="mt-6 flex w-full max-w-[440px] flex-col gap-3 sm:max-w-[520px] sm:flex-row lg:mt-7 lg:w-auto lg:max-w-none">
          <a
            href={CHRISTMAS.smartLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-benton flex min-h-[56px] flex-1 items-center justify-center whitespace-nowrap bg-[#CBB699] px-8 text-[15px] font-bold uppercase tracking-[0.08em] text-[#181818] transition-colors duration-200 hover:bg-[#FAFAFA] lg:min-w-[260px] lg:flex-none"
          >
            {CHRISTMAS.buttonLabel}
            <span className="sr-only">
              {" "}
              {CHRISTMAS.title} (opens in new tab)
            </span>
          </a>

          <button
            type="button"
            onClick={dismiss}
            className="font-benton flex min-h-[56px] flex-1 items-center justify-center whitespace-nowrap border border-[#CBB699]/70 px-8 text-[15px] font-bold uppercase tracking-[0.08em] text-[#F5EEE2] transition-colors duration-200 hover:border-[#FAFAFA] hover:text-[#FAFAFA] lg:min-w-[200px] lg:flex-none"
          >
            Enter Site
          </button>
        </div>

        {/* Arbitration / class-action notice, directly under the entry buttons
            so no visitor can claim they had no notice of it. This is what makes
            "Enter Site" a meaningful consent action rather than just closing an
            overlay. Each of the three phrases deep-links to its own section. */}
        <p className="font-benton mt-5 max-w-[32rem] text-[11px] font-semibold leading-relaxed text-[#FAFAFA]/60 lg:mt-8 lg:text-[12px]">
          By entering, you consent to our{" "}
          <Link
            href="/legal/terms"
            className="font-bold underline underline-offset-2 hover:text-[#FAFAFA]"
          >
            Terms &amp; Conditions
          </Link>
          , including{" "}
          <Link
            href="/legal/terms#section-17"
            className="font-bold underline underline-offset-2 hover:text-[#FAFAFA]"
          >
            binding arbitration
          </Link>{" "}
          and a{" "}
          <Link
            href="/legal/terms#class-action-waiver"
            className="font-bold underline underline-offset-2 hover:text-[#FAFAFA]"
          >
            waiver of class action rights
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
