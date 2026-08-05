"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Cross-fades page content on navigation: the current page fades out, the route
 * changes while nothing is visible, then the new page fades in.
 *
 * An overlay that mounts alongside the new page cannot look smooth -- it does
 * not exist until after the new page has committed, so it can only ever produce
 * a hard cut followed by a fade. Owning both halves means intercepting the
 * click and fading out *before* routing.
 *
 * How a click becomes a transition:
 *
 * 1. Capture-phase interception. One listener on `document` (capture: true)
 *    catches link clicks before React or next/link sees them, then walks up with
 *    `.closest("a")`. No link has to opt in -- every internal anchor gets the
 *    effect for free.
 * 2. Fade out. `preventDefault()` cancels the normal navigation and drops
 *    opacity to 0 over DURATION_MS.
 * 3. Navigate at the bottom of the fade. After a matching timeout it scrolls to
 *    the top and then pushes. Scrolling while the content is invisible is what
 *    hides the jump -- you never see the page rewind.
 * 4. Fade in. An effect on `pathname` fires when the new route mounts, waits
 *    PAINT_MS for it to paint, then returns opacity to 1.
 *
 * Round trip is roughly 950ms: 450 out, ~50 dead, 450 in.
 *
 * Rendered inside the layouts rather than around them, so the fixed site header
 * stays fully opaque while the content beneath it changes. Under
 * prefers-reduced-motion nothing is intercepted and content stays at opacity 1.
 */

const DURATION_MS = 450;
const PAINT_MS = 50;

export default function PageTransition({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  // Starts hidden so the first paint of a route fades up rather than snapping.
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade in whenever the route settles -- initial load and the commit at the
  // end of an intercepted navigation both land here.
  useEffect(() => {
    const paint = setTimeout(() => setVisible(true), PAINT_MS);
    return () => clearTimeout(paint);
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onClick(event: MouseEvent) {
      // Anything that is not a plain left click keeps its native behaviour, so
      // cmd/ctrl/shift-click still open tabs and windows.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (!anchor.getAttribute("href")) return;

      // Same-origin routes only. mailto:, tel:, external hosts and same-page
      // anchors all fall through to default behaviour.
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      const href = url.pathname + url.search + url.hash;

      setVisible(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        window.scrollTo(0, 0);
        router.push(href);
      }, DURATION_MS);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [router]);

  return (
    <div
      className="flex flex-1 flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${DURATION_MS}ms ease-in-out`,
      }}
    >
      {children}
    </div>
  );
}
