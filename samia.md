# Samia Frontend Task Summary

## Assigned Scope

My assigned frontend part is **Person 2: Single + Edit + Delete** for the Post CRUD project.

I worked only on the files related to:

- Viewing a single post by slug
- Editing an existing post
- Deleting a post
- Showing and editing the post author
- Showing post-specific 404 UI
- Showing edit/delete/API validation errors on the frontend

I avoided the shared files listed in the team instructions:

- `app/globals.css`
- `app/layout.tsx`
- `package.json`
- `app/page.tsx`

This keeps my work separate from the listing/create page developer and avoids merge conflicts.

## Files Added

### `app/posts/[slug]/page.tsx`

This file creates the single post page route:

```text
/posts/[slug]
```

What it does:

- Reads the post `slug` from the URL.
- Calls the backend API:

```text
GET /api/posts/[slug]
```

- Displays the post title, slug, content, published status, and updated date.
- Displays the post author when the backend includes it.
- Shows a link back to the posts list.
- Shows an edit link:

```text
/posts/[slug]/edit
```

- Includes the delete button component.
- Calls `notFound()` if the backend returns `404`.
- Shows an error box if the API fails for another reason.

Why it was added:

The project requirement says a single post must open using the `slug`, not the `id`, and a missing slug must show a proper not-found UI instead of crashing.

### `app/posts/[slug]/edit/page.tsx`

This file creates the edit post page route:

```text
/posts/[slug]/edit
```

What it does:

- Reads the post `slug` from the URL.
- Calls the backend API:

```text
GET /api/posts/[slug]
```

- Loads the existing post data.
- Passes the post data into the reusable `PostForm` component.
- Calls `notFound()` if the post does not exist.
- Shows a clear error message if the post cannot be loaded for editing.

Why it was added:

My task includes **Edit Post UI**, which needs to load the existing post first and then let the user update it.

### `app/posts/[slug]/not-found.tsx`

This file creates the not-found UI for missing posts.

What it does:

- Displays a clear `404` message.
- Explains that the post does not exist or may have been deleted.
- Provides a button back to the posts list.

Why it was added:

The task requires a proper not-found UI for invalid slugs. This file is used when `notFound()` is called from the single or edit post page.

### `components/posts/PostForm.tsx`

This is a reusable client-side form component for editing a post.

What it does:

- Shows form fields for:
  - `title`
  - `author`
  - `slug`
  - `content`
  - `published`
- Validates required fields before sending the request.
- Calls the backend API:

```text
PATCH /api/posts/[slug]
```

- Sends the updated post data as JSON.
- Shows validation errors on the page.
- Shows duplicate slug/API errors returned by the backend.
- Shows a loading state while saving.
- Redirects to the updated single post page after a successful save.

Why it was added:

The task requires edit errors, duplicate slug errors, validation messages, and API integration. This component keeps the edit form logic separate from the page file.

### `components/posts/DeletePostButton.tsx`

This is a client-side delete button component.

What it does:

- Shows a delete button.
- Opens a browser confirmation before deleting.
- Calls the backend API:

```text
DELETE /api/posts/[slug]
```

- Shows a loading state while deleting.
- Shows delete/API errors if the delete request fails.
- Redirects back to the posts list after a successful delete.
- Refreshes the route after deletion.

Why it was added:

The task requires Delete Post UI with a delete button, confirmation, API integration, and clear delete errors.

## Backend Contract Used

My frontend expects the backend developer to provide these endpoints:

```text
GET    /api/posts/[slug]
PATCH  /api/posts/[slug]
DELETE /api/posts/[slug]
```

Expected behavior:

```text
GET existing slug       -> returns the post
GET missing slug        -> returns 404
PATCH valid data        -> returns the updated post
PATCH duplicate slug    -> returns an error message
PATCH invalid data      -> returns validation error messages
DELETE existing slug    -> deletes the post
DELETE missing slug     -> returns 404 or an error message
```

The frontend accepts error responses in common formats such as:

```json
{ "message": "Slug already exists" }
```

or:

```json
{ "error": "Post not found" }
```

## Validation and Error Handling

The frontend validates that these fields are not empty:

- `title`
- `author`
- `slug`
- `content`

The backend is still responsible for final validation and database rules, especially duplicate slug prevention.

The frontend displays:

- Required field errors
- Duplicate slug/API errors
- Edit request errors
- Delete request errors
- 404 not-found UI

## Verification

I ran:

```bash
npm run lint
npx tsc --noEmit
```

Both passed successfully.

I also tried:

```bash
npm run build
```

The production build did not complete because of local environment issues with Next/Turbopack and font/CSS processing, not because of TypeScript or lint errors in my files.

## Notes

This work intentionally depends on the backend API being completed by the backend developer. Until those API routes exist, the pages and buttons are implemented against the agreed API contract.
