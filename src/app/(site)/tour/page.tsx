import type { Metadata } from "next";
import { fetchTourDates } from "@/lib/bandsintown";
import { TourDateRow } from "@/components/TourDateRow";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { SubscribeSection } from "@/components/SubscribeSection";
import { kurilian } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Tour — The Band Perry",
  description: "See The Band Perry live. Full list of upcoming tour dates, cities, and ticket links.",
  alternates: { canonical: "https://bandperry.com/tour" },
};

// Bandsintown data changes as shows get added/removed, so this page is
// revalidated hourly (see fetchTourDates) rather than fully static.
export default async function TourPage() {
  const dates = await fetchTourDates();

  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <section data-bg="primary" className="px-5 pt-36 pb-8 lg:px-12">
        <div className="mx-auto max-w-[820px] text-center">
          <h1 className={`${kurilian.className} text-[48px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[64px]`}>
            Tour
          </h1>
        </div>
      </section>

      <section data-bg="primary" className="flex-1 px-5 pb-16 lg:px-12">
        <div className="mx-auto max-w-[820px]">
          {dates.length > 0 ? (
            // Top rule so the first row is bounded the same way every row below
            // it is, rather than floating under the heading.
            <ul className="border-t border-[#aadcf8]/15">
              {dates.map((date) => (
                <TourDateRow key={date.id} date={date} />
              ))}
            </ul>
          ) : (
            <p className="py-16 text-center font-body text-[13px] uppercase tracking-[0.18em] text-[#fafafa]/55">
              No shows currently scheduled. Check back soon.
            </p>
          )}
        </div>
      </section>

      <SubscribeSection />

      <footer className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
        <HomeFooterBar />
      </footer>
    </div>
  );
}
