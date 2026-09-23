"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type PostFormData = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

type PostFormProps = {
  initialPost: PostFormData;
  originalSlug: string;
};

type ApiError = {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};

type ApiPostResponse = {
  slug?: string;
  post?: {
    slug?: string;
  };
};

function getFieldErrors(form: PostFormData) {
  const errors: Partial<Record<keyof PostFormData, string>> = {};

  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.slug.trim()) errors.slug = "Slug is required.";
  if (!form.content.trim()) errors.content = "Content is required.";

  return errors;
}

function getApiErrorMessage(data: ApiError) {
  if (data.message) return data.message;
  if (data.error) return data.error;

  if (data.errors) {
    const firstError = Object.values(data.errors)[0];
    if (Array.isArray(firstError)) return firstError[0] || "Invalid post data.";
    if (firstError) return firstError;
  }

  return "Unable to save this post.";
}

async function readApiError(response: Response) {
  try {
    const data = (await response.json()) as ApiError;
    return getApiErrorMessage(data);
  } catch {
    return "Unable to save this post.";
  }
}

export default function PostForm({ initialPost, originalSlug }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormData>(initialPost);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PostFormData, string>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Field extends keyof PostFormData>(
    field: Field,
    value: PostFormData[Field],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = getFieldErrors(form);
    setFieldErrors(nextFieldErrors);
    setSubmitError("");

    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(originalSlug)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            slug: form.slug.trim(),
            content: form.content.trim(),
            published: form.published,
          }),
        },
      );

      if (!response.ok) {
        setSubmitError(await readApiError(response));
        return;
      }

      const data = (await response.json()) as ApiPostResponse;
      const nextSlug = data.post?.slug || data.slug || form.slug.trim();

      router.push(`/posts/${nextSlug}`);
      router.refresh();
    } catch {
      setSubmitError("Network error. Please try saving the post again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-900"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
        />
        {fieldErrors.title ? (
          <p className="text-sm text-red-600">{fieldErrors.title}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-zinc-900"
        >
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={form.slug}
          onChange={(event) => updateField("slug", event.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
        />
        {fieldErrors.slug ? (
          <p className="text-sm text-red-600">{fieldErrors.slug}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-zinc-900"
        >
          Content
        </label>
        <textarea
          id="content"
          rows={10}
          value={form.content}
          onChange={(event) => updateField("content", event.target.value)}
          className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-200"
        />
        {fieldErrors.content ? (
          <p className="text-sm text-red-600">{fieldErrors.content}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-zinc-900">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) => updateField("published", event.target.checked)}
          className="h-4 w-4 rounded border-zinc-300"
        />
        Published
      </label>

      {submitError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
