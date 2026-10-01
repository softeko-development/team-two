import { NextRequest } from "next/server";
import { handleGetSinglePost, handleUpdatePost, handleDeletePost } from "../../../../post/router/post.router";

export async function GET(_req: NextRequest, { params }: { params: { identifier: string } }) {
  const { identifier } = params;
  return handleGetSinglePost(identifier);
}

export async function PUT(req: NextRequest, { params }: { params: { identifier: string } }) {
  const { identifier } = params;
  return handleUpdatePost(identifier, req);
}

export async function DELETE(_req: NextRequest, { params }: { params: { identifier: string } }) {
  const { identifier } = params;
  return handleDeletePost(identifier);
}
