"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackSpaPageView } from "./injectScripts";

// Fires a pageview on client-side navigations. The initial load's pageview is
// sent by the pixel base snippets themselves (injected after consent), so the
// first render is skipped here to avoid double-counting.
export default function RouteTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackSpaPageView();
  }, [pathname]);

  return null;
}
