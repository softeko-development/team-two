import { NextResponse } from "next/server";
import { createPost, getPostBySlug, updatePost, deletePost, getPostById, listPosts } from "../service/post.service";

type CacheEntry = { data: any; expiresAt: number };
const listCache = new Map<string, CacheEntry>();
const LIST_CACHE_TTL = 30 * 1000; // 30s

function jsonResponse(payload: { success: boolean; data?: any; message?: string }, status = 200) {
  return new NextResponse(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json" } });
}

export async function handleCreatePost(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") return jsonResponse({ success: false, message: "Invalid JSON body" }, 400);
    const { title, slug, content, published } = body;
    if (!title || !slug || !content) {
      return jsonResponse({ success: false, message: "Missing required fields: title, slug, content" }, 400);
    }
    try {
      const post = await createPost({ title, slug, content, published: !!published });
      // invalidate list cache
      listCache.clear();
      return jsonResponse({ success: true, data: post }, 201);
    } catch (err: any) {
      if (err?.code === "P2002") {
        return jsonResponse({ success: false, message: "Slug already exists" }, 409);
      }
      throw err;
    }
  } catch (err: any) {
    const message = err?.message || "Internal server error";
    return jsonResponse({ success: false, message }, 500);
  }
}

export async function handleGetSinglePost(identifier: string) {
  try {
    const post = identifier.includes("-") ? await getPostById(identifier) : await getPostBySlug(identifier);
    if (!post) return jsonResponse({ success: false, message: "Post not found" }, 404);
    return jsonResponse({ success: true, data: post }, 200);
  } catch (err: any) {
    return jsonResponse({ success: false, message: err?.message || "Internal server error" }, 500);
  }
}

export async function handleUpdatePost(identifier: string, req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") return jsonResponse({ success: false, message: "Invalid JSON body" }, 400);
    const where = identifier.includes("-") ? { id: identifier } : { slug: identifier };
    try {
      const post = await updatePost(where, body);
      listCache.clear();
      return jsonResponse({ success: true, data: post }, 200);
    } catch (err: any) {
      if (err?.code === "P2002") return jsonResponse({ success: false, message: "Slug already exists" }, 409);
      throw err;
    }
  } catch (err: any) {
    return jsonResponse({ success: false, message: err?.message || "Internal server error" }, 500);
  }
}

export async function handleDeletePost(identifier: string) {
  try {
    const where = identifier.includes("-") ? { id: identifier } : { slug: identifier };
    const post = await deletePost(where);
    listCache.clear();
    return jsonResponse({ success: true, data: post }, 200);
  } catch (err: any) {
    return jsonResponse({ success: false, message: err?.message || "Internal server error" }, 500);
  }
}

export async function handleListPosts(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "10");
    const search = url.searchParams.get("search") || undefined;
    const publishedParam = url.searchParams.get("published");
    const published = publishedParam === null ? null : publishedParam === "true";

    const cacheKey = `p:${page}|s:${pageSize}|q:${search || ""}|pub:${String(published)}`;
    const cached = listCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return jsonResponse({ success: true, data: cached.data }, 200);
    }

    const result = await listPosts({ page, pageSize, search, published });
    const payload = { items: result.items, total: result.total, page, pageSize };
    listCache.set(cacheKey, { data: payload, expiresAt: Date.now() + LIST_CACHE_TTL });
    return jsonResponse({ success: true, data: payload }, 200);
  } catch (err: any) {
    return jsonResponse({ success: false, message: err?.message || "Internal server error" }, 500);
  }
}
