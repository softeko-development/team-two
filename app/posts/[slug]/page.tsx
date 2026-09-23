import Link from "next/link";
import { notFound } from "next/navigation";
import DeletePostButton from "@/components/posts/DeletePostButton";
import {
  fetchPostBySlug,
  formatPostDate,
  getPostEditPath,
} from "./postApi";

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const result = await fetchPostBySlug(slug);

  if (result.status === "not-found") notFound();

  if (result.status === "error") {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800"
        >
          <h1 className="text-lg font-semibold">Unable to load post</h1>
          <p className="mt-2 text-sm">
            The post could not be loaded right now. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const { post } = result;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
        >
          Back to posts
        </Link>
      </div>

      <article className="space-y-8">
        <header className="space-y-4 border-b border-zinc-200 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {post.published ? "Published" : "Unpublished"}
            </span>
            <span className="text-sm text-zinc-500">
              Updated {formatPostDate(post.updatedAt)}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-500">
              <span>By {post.author || "Unknown author"}</span>
              <span aria-hidden="true">/</span>
              <span>/{post.slug}</span>
            </div>
          </div>
        </header>

        <div className="whitespace-pre-wrap text-base leading-8 text-zinc-800">
          {post.content}
        </div>

        <footer className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6">
          <Link
            href={getPostEditPath(post.slug)}
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
          >
            Edit post
          </Link>
          <DeletePostButton slug={post.slug} />
        </footer>
      </article>
    </main>
  );
}
