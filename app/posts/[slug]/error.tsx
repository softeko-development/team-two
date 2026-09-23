"use client";

import Link from "next/link";

type PostRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostRouteError({
  error,
  reset,
}: PostRouteErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-16">
      <p className="mb-3 text-sm font-medium text-red-600">
        Something went wrong
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
        Unable to show this post
      </h1>
      <p className="mt-3 max-w-lg text-zinc-600">
        The page hit an unexpected error. You can try again or return to the
        posts list.
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-zinc-500">Error ID: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
        >
          Back to posts
        </Link>
      </div>
    </main>
  );
}
