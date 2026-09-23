# Post Module Work Summary

This file summarizes the backend work completed for the Post management system.

## Changed / Added Files

- prisma/schema.prisma
  - Added `Post` model with fields: `id`, `title`, `slug` (unique), `content`, `published` (default false), `createdAt`, `updatedAt`.
  - Removed `url` from datasource declaration to use `prisma7.config.ts` for DB URL.

- lib/prisma.ts
  - Implemented a PrismaClient singleton exported as default.

- post/service/post.service.ts
  - Added service functions interacting with Prisma:
    - `createPost(data)`
    - `getPostBySlug(slug)`
    - `getPostById(id)`
    - `updatePost(identifier, data)`
    - `deletePost(identifier)`
    - `listPosts({ page, pageSize, search, published })` (pagination, search, filter)

- post/router/post.router.ts
  - Added router handlers that use the service layer and return standard JSON responses `{ success, data?, message? }`:
    - `handleCreatePost(req)` — validates input, handles duplicate slug (409), invalid body (400)
    - `handleGetSinglePost(identifier)` — fetch by slug or id (identifier contains `-`)
    - `handleUpdatePost(identifier, req)` — validates input and handles duplicate slug
    - `handleDeletePost(identifier)`
    - `handleListPosts(req)` — supports `page`, `pageSize`, `search`, `published` query params and uses an in-memory cache

- app/api/posts/route.ts
  - Exposes `GET` (list) and `POST` (create) endpoints wired to router handlers.

- app/api/posts/[identifier]/route.ts
  - Exposes `GET`, `PUT`, and `DELETE` for single-post operations via identifier (id or slug).

- .env
  - Added NeonDB connection strings (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`) as provided by the user.

## Database / Migrations

- Generated Prisma Client via `npx prisma generate`.
- Attempted `npx prisma migrate dev --name init` which detected drift and a missing remote migration.
- `npx prisma migrate deploy` failed to reach the Neon pooler in this environment (P1001). You may need to run migrations from a machine/network with access to that DB or adjust connection settings.

## How to run locally (recommended)

1. Copy env file:

```bash
cp .env.example .env
# or use the provided .env
```

2. Start Postgres (Docker) if you want to run locally instead of Neon:

```bash
sudo docker compose up -d
```

3. Install deps:

```bash
npm install
```

4. Generate Prisma client (already done here):

```bash
npx prisma generate
```

5. Apply migrations:

If you're using the local Docker Postgres defined in the repo, run:

```bash
npx prisma migrate dev
```

If you must use Neon and need to reset the DB (destructive):

```bash
npx prisma migrate reset
```

6. Run the app:

```bash
npm run dev
```

7. Useful commands:

```bash
npx prisma studio
sudo docker compose ps
sudo docker compose logs -f postgres
```

## Next steps / Recommendations

- Decide whether to use local Docker Postgres for development (safer) or the provided Neon DB.
- If using Neon, ensure the environment where migrations run has network access to the Neon endpoint.
- Implement frontend pages (listing with pagination/search/filter, single post page by slug).
- Add authentication/authorization if needed.

---

Committed and pushed to branch `sipon`.
