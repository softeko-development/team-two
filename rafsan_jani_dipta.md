# Rafsan Jani Dipta - Work Log

## Completed

- Created and switched to personal branch: `rafsan_jani_dipta`.
- Set the local branch to track the remote branch: `origin/rafsan_jani_dipta`.
- Read the project instruction file, `INSTRUCTIONS.md`.
- Identified the required task: build Post CRUD with Prisma, PostgreSQL, and Next.js.
- Set up the Neon project in this working directory.
- Installed and logged into the Neon CLI.
- Installed Neon skills for the project.
- Configured Neon MCP.
- Linked the project to Neon project `young-poetry-71631757`.
- Linked Neon branch `production`.
- Initialized Neon config.
- Created `neon.ts` with:

```ts
import { defineConfig } from "@neon/config/v1";

export default defineConfig({});
```

- Ran `neon deploy`.
- Pulled Neon database variables into `.env.local`.
- Created `.env` from `.env.local` so Prisma can read `DATABASE_URL`.
- Added the Prisma `Post` model with:
  - `id`
  - `title`
  - `slug`
  - `content`
  - `published`
  - `authorId`
  - `author`
  - `createdAt`
  - `updatedAt`
- Added the Prisma `Author` model with:
  - `id`
  - `name`
  - `email`
  - `posts`
  - `createdAt`
  - `updatedAt`
- Connected `Post` and `Author` with a one-to-many relationship.
- Ran Prisma format.
- Ran Prisma validate.
- Fixed the Prisma migrate error by adding the required `.env` file.

## Current Data Models

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  authorId  String
  author    Author   @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Author {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Next Steps

- Run `npx prisma migrate dev`.
- Give the migration a clear name, such as `add_post_author_models`.
- Commit `prisma/schema.prisma`.
- Commit the generated migration folder inside `prisma/migrations/`.
- Continue with backend API CRUD routes.
