"use client";

import { useSyncExternalStore } from "react";
import { SPLASH_STORAGE_KEY } from "@/lib/pistol";

// The splash signals its state with classes on <html>, set by the pre-paint
// script in the root layout and by SplashGate.tsx on dismissal:
//
//   splash-entered -- the visitor took an explicit entry action.
//   splash-exempt  -- the visitor deep-linked to a legal page, which is never
//                     gated. The splash is hidden, but they have NOT entered.
//
// These are deliberately distinct. "Entered" is consent; "exempt" is just a
// hidden overlay. Reading the Terms must never count as agreeing to them, so
// this hook reports only the first. A visitor sitting on /legal pre-entry is
// therefore still `false` here, and the cookie banner stays away rather than
// stacking a third prompt on someone who has not seen the site yet. TermsGate
// gives that visitor an explicit way in.
//
// A class on <html> rather than React state because the pre-paint script has
// to set it before the first frame, long before React exists, and because
// CSS -- not a re-render -- is what hides the overlay.
function subscribe(onChange: () => void): () => void {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("splash-entered");
}

// The server cannot know the visitor's session, so it always renders as though
// the splash is up. The client corrects it on hydration.
function getServerSnapshot(): boolean {
  return false;
}

export function useSplashEntered(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Mark the visitor as entered immediately, with no exit animation. This is the
// escape hatch for someone who deep-linked to /legal before entering: the
// splash is hidden on that route, so there is no "Enter Site" button for them
// to press, and TermsGate offers this instead.
export function markSplashEntered(): void {
  try {
    sessionStorage.setItem(SPLASH_STORAGE_KEY, new Date().toISOString());
  } catch {
    /* private mode throws -- enter regardless */
  }
  const root = document.documentElement;
  root.classList.remove("splash-exempt");
  root.classList.add("splash-entered");
}
