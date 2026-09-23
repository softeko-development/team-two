"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 6,
    total: 0,
    pageCount: 1,
  });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        search,
        status,
      });

      try {
        const response = await fetch(`/api/posts?${params.toString()}`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Could not load posts.");
        }

        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setPagination(
          data.pagination || {
            page,
            pageSize: 6,
            total: 0,
            pageCount: 1,
          },
        );
      } catch (loadError) {
        setPosts([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load posts.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [page, search, status]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {pagination.total} post{pagination.total === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href="/posts/new"
            className="inline-flex h-10 items-center justify-center bg-neutral-950 px-4 text-sm font-medium text-white"
          >
            New post
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-5 grid gap-3 rounded border border-neutral-200 bg-white p-4 sm:grid-cols-[1fr_190px_auto]"
        >
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by title"
            className="h-10 border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="h-10 border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900"
          >
            <option value="all">All posts</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
          <button className="h-10 bg-neutral-950 px-4 text-sm font-medium text-white">
            Search
          </button>
        </form>

        {error ? (
          <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <section className="overflow-hidden rounded border border-neutral-200 bg-white">
          {isLoading ? (
            <div className="px-4 py-12 text-center text-sm text-neutral-600">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-neutral-600">
              No posts found.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {posts.map((post) => (
                <article key={post.id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold">
                        {post.title}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-600">
                        {post.slug} ·{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-700">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded border border-neutral-300 px-2 py-1 text-xs">
                        {post.published ? "Published" : "Unpublished"}
                      </span>
                      <Link
                        href={`/posts/${post.slug}/edit`}
                        className="rounded border border-neutral-300 px-3 py-1.5 text-sm hover:border-neutral-900"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600">
            Page {pagination.page} of {pagination.pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pagination.pageCount || isLoading}
            onClick={() =>
              setPage((current) => Math.min(current + 1, pagination.pageCount))
            }
            className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
