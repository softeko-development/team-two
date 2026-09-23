import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-16">
      <p className="mb-3 text-sm font-medium text-zinc-500">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
        Post not found
      </h1>
      <p className="mt-3 max-w-lg text-zinc-600">
        The post you are looking for does not exist, or it may have been
        deleted.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Back to posts
      </Link>
    </main>
  );
}
