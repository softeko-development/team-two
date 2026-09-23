import { NextRequest } from "next/server";
import { handleCreatePost, handleListPosts } from "../../../post/router/post.router";

export async function POST(req: NextRequest) {
  return handleCreatePost(req);
}

export async function GET(req: NextRequest) {
  return handleListPosts(req);
}
