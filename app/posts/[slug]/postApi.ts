import { headers } from "next/headers";

export type Post = {
  id: string;
  title: string;
  author?: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiPostResponse = Post | { post?: Post; message?: string; error?: string };

type PostLoadResult =
  | {
      status: "ok";
      post: Post;
    }
  | {
      status: "not-found";
    }
  | {
      status: "error";
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPost(value: unknown): value is Post {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    (typeof value.author === "string" || value.author === undefined) &&
    typeof value.slug === "string" &&
    typeof value.content === "string" &&
    typeof value.published === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function normalizePost(data: ApiPostResponse) {
  if (isRecord(data) && "post" in data) return data.post;
  return data;
}

function getConfiguredAppUrl() {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return undefined;

  const parsedUrl = new URL(appUrl);
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("APP_URL must use http or https.");
  }

  return parsedUrl.origin;
}

async function getApiBaseUrl() {
  const configuredAppUrl = getConfiguredAppUrl();
  if (configuredAppUrl) return configuredAppUrl;

  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_URL must be configured in production.");
  }

  const headersList = await headers();
  const host = headersList.get("host");

  if (!host || /[/?#\\]/.test(host)) return "http://localhost:3000";

  const forwardedProtocol = headersList.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "https" ? "https" : "http";

  return `${protocol}://${host}`;
}

export function getPostPath(slug: string) {
  return `/posts/${encodeURIComponent(slug)}`;
}

export function getPostEditPath(slug: string) {
  return `${getPostPath(slug)}/edit`;
}

export function formatPostDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function fetchPostBySlug(slug: string): Promise<PostLoadResult> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/posts/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) return { status: "not-found" };
  if (!response.ok) return { status: "error" };

  try {
    const data = (await response.json()) as ApiPostResponse;
    const post = normalizePost(data);

    if (!isPost(post)) return { status: "error" };

    return {
      status: "ok",
      post,
    };
  } catch {
    return { status: "error" };
  }
}
