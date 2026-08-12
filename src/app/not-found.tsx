import Link from "next/link";
import type { Metadata } from "next";
import { kurilian } from "@/lib/fonts";

// A 404 must never be indexed, and it inherits the layout's index: true without
// this override.
export const metadata: Metadata = {
  title: "Page Not Found | The Band Perry",
  description: "The page you were looking for could not be found on bandperry.com.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      {/* Matches the content pages: textured near-black ground, kurilian display
          heading in the accent blue, body copy in off-white, and the site's
          notched-corner button for the single way out. */}
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center lg:px-12"
      >
        <p className="font-body text-[12px] uppercase tracking-[0.25em] text-[#fafafa]/55">
          404
        </p>

        <h1
          className={`${kurilian.className} mt-5 text-[40px] uppercase leading-tight tracking-[0.15em] text-[#aadcf8] md:text-[56px]`}
        >
          Page Not Found
        </h1>

        <p className="mt-6 max-w-md font-body text-[15px] leading-[1.85] text-[#fafafa]/85 md:text-base">
          The page you were looking for does not exist, or it has moved somewhere
          else.
        </p>

        <Link
          href="/"
          className={`${kurilian.className} corner-inverted mt-10 px-6 py-3 text-[15px] uppercase tracking-[0.2em] text-[#FAFAFA] transition-colors duration-200 hover:text-[#292929]`}
        >
          Go Home
        </Link>
      </main>
    </div>
  );
}
