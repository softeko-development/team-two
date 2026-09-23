"use client";

import { FormEvent, useState } from "react";

export type PostFormValues = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

type PostFormProps = {
  initialValues?: PostFormValues;
  submitLabel: string;
  savingLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
  apiErrors?: Record<string, string>;
};

const emptyValues: PostFormValues = {
  title: "",
  slug: "",
  content: "",
  published: false,
};

function validate(values: PostFormValues) {
  const errors: Record<string, string> = {};

  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.slug.trim()) errors.slug = "Slug is required.";
  if (!values.content.trim()) errors.content = "Content is required.";

  return errors;
}

export default function PostForm({
  initialValues = emptyValues,
  submitLabel,
  savingLabel,
  onSubmit,
  apiErrors = {},
}: PostFormProps) {
  const [values, setValues] = useState(initialValues);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const errors = { ...clientErrors, ...apiErrors };

  function updateValue<Key extends keyof PostFormValues>(
    key: Key,
    value: PostFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setClientErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    const nextErrors = validate(values);
    setClientErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        slug: values.slug.trim(),
        content: values.content.trim(),
        published: values.published,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-neutral-800">Title</span>
        <input
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          className="mt-1 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-900"
        />
        {errors.title ? (
          <span className="mt-1 block text-sm text-red-700">{errors.title}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-neutral-800">Slug</span>
        <input
          value={values.slug}
          onChange={(event) => updateValue("slug", event.target.value)}
          className="mt-1 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-900"
        />
        {errors.slug ? (
          <span className="mt-1 block text-sm text-red-700">{errors.slug}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-neutral-800">Content</span>
        <textarea
          value={values.content}
          onChange={(event) => updateValue("content", event.target.value)}
          rows={8}
          className="mt-1 w-full resize-y border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
        {errors.content ? (
          <span className="mt-1 block text-sm text-red-700">
            {errors.content}
          </span>
        ) : null}
      </label>

      <label className="flex items-center gap-3 border border-neutral-200 bg-white px-3 py-3">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(event) => updateValue("published", event.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium text-neutral-800">Published</span>
      </label>

      <button
        type="submit"
        disabled={isSaving}
        className="h-11 w-full bg-neutral-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? savingLabel : submitLabel}
      </button>
    </form>
  );
}
