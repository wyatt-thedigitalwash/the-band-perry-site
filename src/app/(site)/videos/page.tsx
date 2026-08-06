import type { Metadata } from "next";
import { VideoGallery } from "@/components/VideoGallery";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { SubscribeSection } from "@/components/SubscribeSection";
import { kurilian } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Videos | The Band Perry",
  description:
    "Watch The Band Perry's official music videos, from If I Die Young to the new era of Psychological, Buzzards, and Kill It.",
  alternates: { canonical: "https://bandperry.com/videos" },
};

export default function VideosPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <section data-bg="primary" className="px-5 pt-36 pb-10 lg:px-12">
        <div className="mx-auto max-w-[1100px] text-center">
          <h1
            className={`${kurilian.className} text-[48px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[64px]`}
          >
            Videos
          </h1>
        </div>
      </section>

      <section data-bg="primary" className="flex-1 px-5 pb-16 lg:px-12">
        <VideoGallery />
      </section>

      <SubscribeSection />

      <footer className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
        <HomeFooterBar />
      </footer>
    </div>
  );
}
