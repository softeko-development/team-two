# Intern Team Task — Post CRUD

## 1. Team Rules

- Everybody will create a branch on GitHub **with your own name** and push your
  work on that branch.
- **Never push directly to `main`.** Open a **Pull Request** into `main`.
- The team will **divide the task** between yourselves.
- Every member must have real commits.

---

## 2. How to run the project

Docker runs **only the database**. The Next.js app runs on your own machine
with `npm run dev`.

**Step 1 — copy the env file**

```bash
cd /your-project-path
cp .env.example .env
```

**Step 2 — start the database**

```bash
sudo docker compose up -d
```

**Step 3 — install packages**

```bash
npm install
```

**Step 4 — apply the database schema**

```bash
npx prisma migrate dev
```

Run this again every time you change `prisma/schema.prisma`. It creates a new
migration file — **commit that file**, otherwise your teammates' databases will
not match yours.

**Step 5 — run the app**

```bash
npm run dev
```

Open http://localhost:3000

---

To stop the database:

```bash
sudo docker compose down
```

Useful:

```bash
sudo docker compose ps             # is the database running?
sudo docker compose logs -f postgres   # database logs
npx prisma studio                  # browse the data in your browser
```

Notes:

- The app reads `DATABASE_URL` from `.env`, which points at
  `localhost:5432` — that is the Postgres container.
- `docker compose down -v` also **deletes all your data**. Use it only when you
  want a clean database.

---

## 3. Task / Requirements

**Deadline:** **\_\_\_** (your team will be told this separately)

### 3.1 — Post schema

Create a `Post` table with these fields:

- `id`
- `title`
- `slug` — must be **unique**
- `content`
- `published` — true / false, default false
- `createdAt`
- `updatedAt`

The schema file is empty right now. You have to write the model yourself.

### 3.2 — CRUD

- Build the backend API first: create, read (list + single), update, delete.
- Then build the frontend on top of it.

### 3.3 — Listing page

Show the list of posts, with:

- newest post first
- pagination
- search by title
- filter by published / unpublished

### 3.4 — Single post page

- Open one post on its own page using the **`slug`**, not the `id`.
- A slug that does not exist must show a proper "not found" page, not a crash.

### 3.5 — Validation and XSS

- Validate the input before saving. Empty or invalid data must be rejected.
- A duplicate `slug` must be handled properly, with a clear message.
- Every error must be **shown to the user on the screen** with a clear message.

### 3.7 — Caching (bonus)

- The listing page should not hit the database on every single request.
