"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PostForm, { PostFormValues } from "../PostForm";

export default function NewPostPage() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function createPost(values: PostFormValues) {
    setApiErrors({});
    setMessage("");

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.errors) {
        setApiErrors(data.errors);
        return;
      }

      setMessage(data.message || "Could not create post.");
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
          <h1 className="text-2xl font-semibold tracking-tight">Create post</h1>
          {message ? (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {message}
            </div>
          ) : null}
          <div className="mt-5">
            <PostForm
              submitLabel="Create post"
              savingLabel="Creating..."
              apiErrors={apiErrors}
              onSubmit={createPost}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
