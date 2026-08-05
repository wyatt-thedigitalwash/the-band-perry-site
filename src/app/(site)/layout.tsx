import PageTransition from "@/components/PageTransition";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Layout for every page that carries the persistent header (tour, music, about
 * and all /legal routes). The header lives here rather than inside each page so
 * it stays mounted across navigations within this group -- rendering it per page
 * re-created the wordmark <img> on every route change, which made the logo
 * visibly flash. `(site)` is a route group, so it adds no URL segment.
 *
 * The home splash at `/` sits outside this group and keeps its header-free,
 * full-screen treatment. `SiteHeader` is `position: fixed`, so it imposes no
 * layout on the pages it sits above; each page still owns its own background
 * wrapper and top padding.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      {/* The header sits outside the fade so it stays fully opaque while the
          content beneath it cross-fades on navigation. */}
      <PageTransition>{children}</PageTransition>
    </>
  );
}
