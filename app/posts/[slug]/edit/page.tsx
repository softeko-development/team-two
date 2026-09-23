import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PostForm, { PostFormData } from "@/components/posts/PostForm";

type Post = PostFormData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type ApiPostResponse = Post | { post?: Post; message?: string; error?: string };

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

function normalizePost(data: ApiPostResponse) {
  if ("post" in data) return data.post;
  if ("slug" in data) return data;
  return undefined;
}

export default async function EditPostPage({
  params,
}: PageProps<"/posts/[slug]/edit">) {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  const response = await fetch(
    `${baseUrl}/api/posts/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) notFound();

  if (!response.ok) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
        <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
          <h1 className="text-lg font-semibold">Unable to load editor</h1>
          <p className="mt-2 text-sm">
            The post could not be loaded for editing. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const data = (await response.json()) as ApiPostResponse;
  const post = normalizePost(data);

  if (!post) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
      <div className="mb-8">
        <Link
          href={`/posts/${post.slug}`}
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
            slug: post.slug,
            content: post.content,
            published: post.published,
          }}
        />
      </div>
    </main>
  );
}
