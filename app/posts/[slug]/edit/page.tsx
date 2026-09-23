"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm, { PostFormValues } from "../../PostForm";

type Post = PostFormValues & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export default function EditPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      setMessage("");

      try {
        const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Could not load post.");
        }

        setPost(data.post);
      } catch (loadError) {
        setMessage(
          loadError instanceof Error
            ? loadError.message
            : "Could not load post.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  async function updatePost(values: PostFormValues) {
    setApiErrors({});
    setMessage("");

    const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.errors) {
        setApiErrors(data.errors);
        return;
      }

      setMessage(data.message || "Could not update post.");
      return;
    }

    router.push("/posts");
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-950">
      <div className="mx-auto max-w-2xl">
        <Link href="/posts" className="text-sm text-neutral-600 underline">
          Back to posts
        </Link>
        <div className="mt-5 rounded border border-neutral-200 bg-white p-5">
          <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>

          {message ? (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {message}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-5 text-sm text-neutral-600">Loading post...</div>
          ) : post ? (
            <div className="mt-5">
              <PostForm
                initialValues={{
                  title: post.title,
                  slug: post.slug,
                  content: post.content,
                  published: post.published,
                }}
                submitLabel="Update post"
                savingLabel="Saving..."
                apiErrors={apiErrors}
                onSubmit={updatePost}
              />
            </div>
          ) : (
            <p className="mt-5 text-sm text-neutral-600">Post was not found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
