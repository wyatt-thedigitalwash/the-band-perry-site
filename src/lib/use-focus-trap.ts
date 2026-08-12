"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Keeps Tab inside an open dialog and hands focus back where it came from.
 *
 * Without this, tabbing out of a modal walks the page behind it: the dialog
 * stays visible while focus lands on links the user cannot see, which is the
 * classic WCAG 2.1.2 (No Keyboard Trap) / 2.4.3 (Focus Order) failure for
 * modals. Restoring focus on close matters just as much -- otherwise focus
 * resets to the top of the document and the keyboard user loses their place.
 *
 * Pass `active: false` when the dialog is closed so the listener is not bound.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;

    // Captured before any focus moves into the dialog, so this is the control
    // the user actually opened it from.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const items = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Wrap at both ends, and pull focus back in if it has escaped entirely
      // (e.g. it was on the body when the dialog opened).
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [containerRef, active]);
}
