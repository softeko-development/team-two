import prisma from "../../lib/prisma";

type PostCreateInput = {
  title: string;
  slug: string;
  content: string;
  published?: boolean;
};

type PostUpdateInput = Partial<PostCreateInput>;

export async function createPost(data: PostCreateInput) {
  const post = await prisma.post.create({ data });
  return post;
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({ where: { slug } });
  return post;
}

export async function listPosts(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  published?: boolean | null;
}) {
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 10;

  const where: any = {};
  if (options.search) {
    where.title = { contains: options.search, mode: "insensitive" };
  }
  if (typeof options.published === "boolean") {
    where.published = options.published;
  }

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  return { items, total };
}

export async function updatePost(identifier: { id?: string; slug?: string }, data: PostUpdateInput) {
  const where = identifier.id ? { id: identifier.id } : { slug: identifier.slug! };
  const post = await prisma.post.update({ where, data });
  return post;
}

export async function deletePost(identifier: { id?: string; slug?: string }) {
  const where = identifier.id ? { id: identifier.id } : { slug: identifier.slug! };
  const post = await prisma.post.delete({ where });
  return post;
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}
