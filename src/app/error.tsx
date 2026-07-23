'use client';

import Link from 'next/link';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold sm:text-4xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-gray-600">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => unstable_retry()}
          className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
