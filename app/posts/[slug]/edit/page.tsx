import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { fetchPostBySlug, getPostPath } from "../postApi";

export default async function EditPostPage({
  params,
}: PageProps<"/posts/[slug]/edit">) {
  const { slug } = await params;
  const result = await fetchPostBySlug(slug);

  if (result.status === "not-found") notFound();

  if (result.status === "error") {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800"
        >
          <h1 className="text-lg font-semibold">Unable to load editor</h1>
          <p className="mt-2 text-sm">
            The post could not be loaded for editing. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const { post } = result;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
      <div className="mb-8">
        <Link
          href={getPostPath(post.slug)}
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
        >
          Back to post
        </Link>
      </div>

      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Edit post
          </h1>
          <p className="text-sm text-zinc-600">
            Update the post details and save your changes.
          </p>
        </header>

        <PostForm
          originalSlug={post.slug}
          initialPost={{
            title: post.title,
            author: post.author ?? "",
            slug: post.slug,
            content: post.content,
            published: post.published,
          }}
        />
      </div>
    </main>
  );
}
