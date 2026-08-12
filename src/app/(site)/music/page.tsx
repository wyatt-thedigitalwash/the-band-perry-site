import type { Metadata } from "next";
import { RELEASES } from "@/lib/releases";
import { MusicReleaseCard } from "@/components/MusicReleaseCard";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { SubscribeSection } from "@/components/SubscribeSection";
import { kurilian } from "@/lib/fonts";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, musicReleasesSchema } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Music | The Band Perry",
  description:
    "Stream The Band Perry's new singles and greatest hits, from Psychological, Buzzards and Kill It back to If I Die Young, on every major streaming platform.",
  ...pageUrls("/music"),
};

export default function MusicPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <JsonLd data={breadcrumbSchema([{ name: "Music", path: "/music" }])} />
      <JsonLd data={musicReleasesSchema()} />

      <main id="main-content" className="flex flex-1 flex-col">
        <section aria-label="Page title" data-bg="primary" className="px-5 pt-36 pb-8 lg:px-12">
          <div className="mx-auto max-w-[1000px] text-center">
            <h1 className={`${kurilian.className} text-[48px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[64px]`}>
              Music
            </h1>
          </div>
        </section>

        <section aria-label="Releases" data-bg="primary" className="flex-1 px-5 pb-16 lg:px-12">
          <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-8 md:gap-y-12">
            {RELEASES.map((release) => (
              <MusicReleaseCard key={release.title} release={release} />
            ))}
          </div>
        </section>

        <SubscribeSection />
      </main>

      <footer className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
        <HomeFooterBar />
      </footer>
    </div>
  );
}
