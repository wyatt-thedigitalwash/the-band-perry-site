import type { Metadata } from "next";
import { VideoGallery } from "@/components/VideoGallery";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { SubscribeSection } from "@/components/SubscribeSection";
import { kurilian } from "@/lib/fonts";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, videosSchema } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Videos | The Band Perry",
  description:
    "Watch every official music video from The Band Perry, from If I Die Young and Better Dig Two through to the new era of Psychological, Buzzards and Kill It.",
  ...pageUrls("/videos"),
};

export default function VideosPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <JsonLd data={breadcrumbSchema([{ name: "Videos", path: "/videos" }])} />
      <JsonLd data={videosSchema()} />

      <main id="main-content" className="flex flex-1 flex-col">
        <section aria-label="Page title" data-bg="primary" className="px-5 pt-36 pb-10 lg:px-12">
          <div className="mx-auto max-w-[1100px] text-center">
            <h1
              className={`${kurilian.className} text-[48px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[64px]`}
            >
              Videos
            </h1>
          </div>
        </section>

        <section aria-label="Music videos" data-bg="primary" className="flex-1 px-5 pb-16 lg:px-12">
          <VideoGallery />
        </section>

        <SubscribeSection />
      </main>

      <footer className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
        <HomeFooterBar />
      </footer>
    </div>
  );
}
