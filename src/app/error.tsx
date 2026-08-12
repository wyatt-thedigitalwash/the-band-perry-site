"use client";

import Link from "next/link";
import { useEffect } from "react";
import { kurilian } from "@/lib/fonts";

/**
 * Route-level error boundary, styled to match the content pages.
 *
 * The `digest` is the only thing surfaced about the failure: Next replaces a
 * server error's message and stack with that opaque hash in production
 * precisely so internals never reach the browser, and it is what correlates a
 * user's report with the real entry in the server logs.
 *
 * Next 16 passes both `reset` and `unstable_retry` to this component but only
 * types the latter, so `unstable_retry` is the one that typechecks here. It is
 * the same retry the brief asks the button to call.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col bg-black bg-[url('/images/bg-texture.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center lg:px-12"
      >
        <h1
          className={`${kurilian.className} text-[40px] uppercase leading-tight tracking-[0.15em] text-[#aadcf8] md:text-[56px]`}
        >
          Something Went Wrong
        </h1>

        <p className="mt-6 max-w-md font-body text-[15px] leading-[1.85] text-[#fafafa]/85 md:text-base">
          An unexpected error occurred on our end. Please try again, or head back
          to the home page.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className={`${kurilian.className} corner-inverted px-6 py-3 text-[15px] uppercase tracking-[0.2em] text-[#FAFAFA] transition-colors duration-200 hover:text-[#292929]`}
          >
            Try Again
          </button>
          <Link
            href="/"
            className={`${kurilian.className} corner-inverted px-6 py-3 text-[15px] uppercase tracking-[0.2em] text-[#FAFAFA] transition-colors duration-200 hover:text-[#292929]`}
          >
            Go Home
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-8 font-body text-[11px] uppercase tracking-[0.18em] text-[#fafafa]/55">
            Reference: {error.digest}
          </p>
        ) : null}
      </main>
    </div>
  );
}
