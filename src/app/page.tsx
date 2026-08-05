import Image from "next/image";
import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { HeroNavButtons } from "@/components/HeroNavButtons";
import { HomeFooterBar } from "@/components/HomeFooterBar";

export const metadata: Metadata = {
  title: "The Band Perry | Official Website",
  description:
    "Discover The Band Perry's latest music, tour dates, and merchandise. Stay updated with news and join fans in celebrating country music success.",
};

export default function Home() {
  return (
    // The splash sits outside the (site) route group, so it carries its own
    // PageTransition -- that instance owns the fade-out when a visitor leaves
    // home, the same way the group layout's instance does for every other page.
    <PageTransition>
      <div className="relative flex h-dvh w-full flex-col overflow-hidden overscroll-none bg-black">
        <HeroVideoBackground />

        <main className="relative flex flex-1 flex-col items-center justify-center gap-10 px-6 sm:gap-12">
          <Image
            src="/images/logo-horizontal-wordmark-blue-textured.png"
            alt="The Band Perry"
            width={2326}
            height={583}
            priority
            className="w-[min(90vw,640px)] h-auto"
          />
          <HeroNavButtons />
        </main>

        <footer className="relative w-full px-6 pb-6 sm:px-10 sm:pb-8">
          <HomeFooterBar />
        </footer>
      </div>
    </PageTransition>
  );
}
