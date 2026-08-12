import Image from "next/image";
import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { HeroNavButtons } from "@/components/HeroNavButtons";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { pageUrls } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Band Perry | Official Website",
  description:
    "The official site of The Band Perry. Stream the new music, watch the official videos, browse upcoming tour dates and tickets, and shop official merch.",
  ...pageUrls("/"),
};

export default function Home() {
  return (
    // The splash sits outside the (site) route group, so it carries its own
    // PageTransition -- that instance owns the fade-out when a visitor leaves
    // home, the same way the group layout's instance does for every other page.
    <PageTransition>
      <div className="relative flex h-dvh w-full flex-col overflow-hidden overscroll-none bg-black">
        <HeroVideoBackground />

        <main
          id="main-content"
          className="relative flex flex-1 flex-col items-center justify-center gap-10 px-6 sm:gap-12"
        >
          {/* The wordmark is the splash page's only title, so it carries the
              h1 rather than the page having none. Tailwind's preflight strips
              the heading's default size and margin, so the lockup renders
              exactly as it did when the image stood alone. */}
          <h1>
            <Image
              src="/images/logo-horizontal-wordmark-blue-textured.png"
              alt="The Band Perry"
              width={2326}
              height={583}
              priority
              className="w-[min(90vw,640px)] h-auto"
            />
          </h1>
          <HeroNavButtons />
        </main>

        <footer className="relative w-full px-6 pb-6 sm:px-10 sm:pb-8">
          <HomeFooterBar />
        </footer>
      </div>
    </PageTransition>
  );
}
