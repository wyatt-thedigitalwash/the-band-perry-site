"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PISTOL, SPLASH_STORAGE_KEY } from "@/lib/pistol";
import { useSplashEntered } from "@/components/consent/useSplashEntered";
import { useFocusTrap } from "@/lib/use-focus-trap";

/**
 * Full-screen release gate shown once per session before a visitor reaches the
 * site, announcing the "Pistol" single.
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
      // Painted the banner's own paper colour. Measured, not guessed: the mean
      // luminance of the artwork's empty right-hand band is 23.3, so #171717 is
      // what makes the right column read as the same paper as the left rather
      // than as a lighter panel beside it. It also keeps the frame the image is
      // still decoding into from flashing black.
      // Below lg this is a plain full-bleed box: the banner covers it and the
      // copy sits in a bar along the bottom. At lg it becomes two columns --
      // artwork left, copy right. 55/45 rather than an even split because the
      // lockup needs the wider half to read at a decent size.
      className="fixed inset-0 z-[80] overflow-hidden bg-[#171717] lg:grid lg:grid-cols-[56fr_44fr]"
      role="dialog"
      aria-modal="true"
      aria-label={`${PISTOL.title}, the new single from The Band Perry`}
    >
      {/* Below lg the banner is a full-bleed background with the copy in a bar
          along the bottom; the bar is sized to the empty margin the artwork
          leaves under the lockup (15.5% of the desktop banner's height, 34.6%
          of the mobile one's) so a plain centred crop clears it.

          Art direction: the two banners are separate compositions (16:9 and
          9:16), not crops of one another, so next/image's own srcset cannot
          cover both. Two elements toggled at the 768px breakpoint is the
          pattern Next documents for this.

          Every candidate is in the DOM at every width, and a `display: none`
          <img> is still fetched. Declaring the off-breakpoint ones as 1px wide
          is what stops that: the browser picks the smallest srcset candidate
          for the art it is not showing, so only the right one is really
          downloaded. It also matches what each element actually measures,
          which is what next/image's sizes warning is asking for. */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={PISTOL.bannerMobile.src}
          alt={PISTOL.bannerAlt}
          fill
          sizes="(min-width: 768px) 1px, 100vw"
          priority
          className="object-cover object-center md:hidden"
        />
        <Image
          src={PISTOL.bannerDesktop.src}
          alt={PISTOL.bannerAlt}
          fill
          sizes="(min-width: 1024px) 1px, (min-width: 768px) 100vw, 1px"
          priority
          className="hidden object-cover object-center md:block"
        />
      </div>

      {/* At lg the left column carries the square sleeve instead of a cropped
          banner. Cropping the 16:9 banner into a half-width column left its cut
          edge butting against the flat background, and no amount of colour
          matching hides texture meeting no-texture. The sleeve sidesteps that
          entirely: it carries its own frame, so it reads as artwork resting on
          the page rather than as a panel spliced into it.

          Sized by whichever runs out first, the column's width or the
          viewport's height, so it stays square and never overflows. */}
      <div className="hidden items-center justify-center p-10 lg:flex xl:p-14">
        <div className="relative aspect-square w-full max-w-[calc(100dvh-6rem)] xl:max-w-[calc(100dvh-8rem)]">
          <Image
            src={PISTOL.cover.src}
            alt={PISTOL.coverAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 1px"
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* One bar under the lockup: the announcement, the two actions, and the
          arbitration notice. Deliberately shallow, because that is what fits
          inside the artwork's own bottom margin once the banner is cropped to
          fill the window. Anything taller starts climbing onto the lips. */}
      <div
        ref={panelRef}
        className="splash-rise absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-5 text-center lg:relative lg:inset-auto lg:h-full lg:items-start lg:justify-center lg:px-12 lg:pb-0 lg:text-left xl:px-16"
      >
        {/* A row beside the artwork does not fit in the right column, so at lg
            this returns to a stack -- which is also what lets the announcement
            wrap and set at display size. */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:flex-col lg:items-start lg:gap-8">
          {/* A <p>, not a heading: this overlay now renders on every route, and
              an h2 announcing a single would land in the middle of the heading
              outline of /tour, /music and every legal page.

              The "new single" framing lives in this line rather than in an
              eyebrow above it: the band under the lockup is only tall enough
              for one row, so a second line would push the bar onto the artwork.

              `lining-nums` is not cosmetic: freight-sans-pro ships old-style
              figures by default, which sets the 4 as a descending lowercase
              numeral that hangs below the baseline. lnum switches it to the
              cap-height form so it sits level with the letters beside it. */}
          <p className="font-freight text-[17px] font-bold uppercase leading-none tracking-[0.01em] text-[#EBB703] lining-nums sm:text-[24px] lg:flex lg:flex-col-reverse lg:items-start lg:gap-1.5">
            {/* Source order stays "New Single Out September 4" -- that is the
                sentence, and it is what a screen reader and the single-line
                mobile bar both need. `flex-col-reverse` flips only the visual
                stacking at lg, putting the date on top without rearranging the
                words. Reordering the markup instead would read backwards
                everywhere the layout is not a two-line stack.

                A whitespace-only text node between flex items is not rendered
                (CSS Flexbox §4), so the space below only joins the two halves
                on the single line and adds nothing to the stack. */}
            <span className="lg:text-[23px] xl:text-[26px]">
              {PISTOL.leadIn}
            </span>{" "}
            <time
              dateTime={PISTOL.releaseDate}
              className="lg:text-[36px] lg:leading-[1.05] xl:text-[42px]"
            >
              {PISTOL.releaseLabel}
            </time>
          </p>

          {/* Its own flex item rather than the last glyph inside the line, so
              the row's `gap` sets the space on BOTH sides of it. Inline it was
              preceded by an ordinary word space -- about a quarter of an em,
              nothing like the 24px gap that followed it.

              Separator, and only that: hidden from screen readers, which would
              announce it as "vertical line" mid-sentence, and hidden wherever
              the bar stacks -- on mobile and again at lg -- since a trailing
              rule above a stack points at nothing. A display:none flex item is
              removed from layout entirely, so it leaves no phantom gap. */}
          <span
            aria-hidden="true"
            className="font-freight hidden text-[24px] font-bold leading-none text-[#EBB703] sm:block lg:hidden"
          >
            |
          </span>

          {/* 380px rather than 320: on a 390px phone the row is already capped
              at the available width (~350px after the bar's own padding), so
              raising the ceiling simply lets the pair use it. At 320 each half
              came out ~154px, which was under what "Enter Site" needs and broke
              the label onto a second line. */}
          <div className="flex w-full max-w-[380px] items-center gap-3 sm:w-auto sm:max-w-none lg:gap-4">
            <a
              href={PISTOL.smartLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-freight flex min-h-[44px] flex-1 items-center justify-center whitespace-nowrap bg-[#EBB703] px-6 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#161616] sm:px-8 transition-colors duration-200 hover:bg-[#FAFAFA] sm:flex-none"
            >
              {PISTOL.buttonLabel}
              <span className="sr-only">
                {" "}
                {PISTOL.title} (opens in new tab)
              </span>
            </a>

            <button
              type="button"
              onClick={dismiss}
              className="font-freight flex min-h-[44px] flex-1 items-center justify-center whitespace-nowrap border border-[#FAFAFA]/40 px-6 text-[13px] font-medium uppercase tracking-[0.04em] text-[#FAFAFA] sm:px-8 transition-colors duration-200 hover:border-[#EBB703] hover:text-[#EBB703] sm:flex-none"
            >
              Enter Site
            </button>
          </div>
        </div>

        {/* Arbitration / class-action notice, directly under the entry buttons
            so no visitor can claim they had no notice of it. This is what makes
            "Enter Site" a meaningful consent action rather than just closing an
            overlay. Each of the three phrases deep-links to its own section.
            One line on desktop by design -- the band beneath the lockup has
            room for the bar and this, and nothing more. */}
        <p className="font-freight mt-3 max-w-[30rem] text-[11px] leading-relaxed text-[#FAFAFA]/60 sm:max-w-none lg:mt-10 lg:max-w-[30rem] lg:text-[12px]">
          By entering, you consent to our{" "}
          <Link
            href="/legal/terms"
            className="font-semibold underline underline-offset-2 hover:text-[#FAFAFA]"
          >
            Terms &amp; Conditions
          </Link>
          , including{" "}
          <Link
            href="/legal/terms#section-17"
            className="font-semibold underline underline-offset-2 hover:text-[#FAFAFA]"
          >
            binding arbitration
          </Link>{" "}
          and a{" "}
          <Link
            href="/legal/terms#class-action-waiver"
            className="font-semibold underline underline-offset-2 hover:text-[#FAFAFA]"
          >
            waiver of class action rights
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
