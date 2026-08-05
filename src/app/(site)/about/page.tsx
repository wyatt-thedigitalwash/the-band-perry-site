import type { Metadata } from "next";
import Image from "next/image";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { SubscribeSection } from "@/components/SubscribeSection";
import { kurilian } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "About — The Band Perry",
  description:
    "The story of The Band Perry: a GRAMMY, CMA, and ACM Award-winning duo known for their genre-defying Appalachian gothic sound.",
  alternates: { canonical: "https://bandperry.com/about" },
};

const PHOTO_ALT =
  "A man and woman sitting on the floor against a weathered wall with peeling paint in an old building. The woman has long blonde hair and wears a light gray dress and black lace-up boots. The man has blond hair, wears a black leather jacket, cream-colored pants, and black shoes, with his arms crossed and looking to the right.";

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <section data-bg="primary" className="px-5 pt-36 pb-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <h1 className={`${kurilian.className} text-[48px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[64px]`}>
            Our Story
          </h1>
        </div>
      </section>

      <section data-bg="primary" className="flex-1 px-5 pb-16 lg:px-12">
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,0.85fr)_1fr] md:gap-14">
          <div className="mx-auto w-full max-w-[380px] md:mx-0">
            <Image
              src="/images/about-photo.png"
              alt={PHOTO_ALT}
              width={1103}
              height={1607}
              priority
              className="h-auto w-full"
            />
          </div>

          <div className="space-y-5 font-body text-[15px] leading-[1.85] text-[#fafafa]/85 md:text-base">
            <p>
              The Band Perry is a GRAMMY&reg;, CMA, and ACM Award-winning duo known for their
              genre-defying sound and bold artistic reinvention. Since bursting onto the scene with
              their 9x Platinum smash hit &ldquo;If I Die Young,&rdquo; the Band, led by the artistic
              eye and creative direction of lead singer / songwriter, Kimberly, have captivated
              audiences worldwide. The band&rsquo;s 2025 return marks the end of hiatus and the start
              of the band&rsquo;s next era.
            </p>
            <p>
              Spanning a decade-plus of music and two albums, The Band Perry has sold two and a half
              million albums, 12 million singles, and racked up over 1 billion streams. Their success
              story continues to grow both domestically and globally, a talent powerhouse touting
              sold-out world tours, six #1 singles, multiple RIAA Platinum and Gold certifications,
              and pioneering chart success. Their Appalachian gothic sound is amplified by heartfelt,
              original storytelling, dynamic musicianship, and high-energy performance. Known for
              pushing creative boundaries while staying rooted in Southern tradition, the duo
              continues to evolve, both artistically and as individuals.
            </p>
          </div>
        </div>
      </section>

      <SubscribeSection />

      <footer className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
        <HomeFooterBar />
      </footer>
    </div>
  );
}
