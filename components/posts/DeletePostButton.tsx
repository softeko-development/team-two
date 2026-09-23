"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeletePostButtonProps = {
  slug: string;
  redirectTo?: string;
};

type ApiError = {
  message?: string;
  error?: string;
};

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as ApiError;
    return data.message || data.error || "Unable to delete this post.";
  } catch {
    return "Unable to delete this post.";
  }
}

export default function DeletePostButton({
  slug,
  redirectTo = "/",
}: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this post? This action cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError(await readErrorMessage(response));
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try deleting the post again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
      >
        {isDeleting ? "Deleting..." : "Delete post"}
      </button>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
