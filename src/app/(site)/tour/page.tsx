import { Fragment } from "react";
import type { Metadata } from "next";
import { fetchTourDates } from "@/lib/bandsintown";
import { TourDateRow, TourDivider } from "@/components/TourDateRow";
import { HomeFooterBar } from "@/components/HomeFooterBar";
import { SubscribeSection } from "@/components/SubscribeSection";
import { kurilian } from "@/lib/fonts";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, tourEventsSchema } from "@/lib/schema";
import { pageUrls } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tour | The Band Perry",
  description:
    "See The Band Perry live on tour. Browse every upcoming show date with the city, venue and set time, then grab tickets or RSVP for the date nearest you.",
  ...pageUrls("/tour"),
};

// Bandsintown data changes as shows get added/removed, so this page is
// revalidated hourly (see fetchTourDates) rather than fully static.
export default async function TourPage() {
  const dates = await fetchTourDates();

  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <JsonLd data={breadcrumbSchema([{ name: "Tour", path: "/tour" }])} />
      {/* Only emit event data when there are shows -- an empty ItemList is a
          structured-data error, not a neutral no-op. */}
      {dates.length > 0 ? <JsonLd data={tourEventsSchema(dates)} /> : null}

      <main id="main-content" className="flex flex-1 flex-col">
        <section aria-label="Page title" data-bg="primary" className="px-5 pt-36 pb-8 lg:px-12">
          <div className="mx-auto max-w-[820px] text-center">
            <h1 className={`${kurilian.className} text-[48px] uppercase tracking-[0.15em] text-[#aadcf8] md:text-[64px]`}>
              Tour
            </h1>
          </div>
        </section>

        <section aria-label="Tour dates" data-bg="primary" className="flex-1 px-5 pb-16 lg:px-12">
          <div className="mx-auto max-w-[820px]">
            {dates.length > 0 ? (
              // Ornamental dividers sit between rows only, so the first and last
              // rows are bounded by whitespace rather than rules.
              <ul>
                {dates.map((date, index) => (
                  <Fragment key={date.id}>
                    {index > 0 ? <TourDivider /> : null}
                    <TourDateRow date={date} />
                  </Fragment>
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
      </main>

      <footer className="w-full px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
        <HomeFooterBar />
      </footer>
    </div>
  );
}
