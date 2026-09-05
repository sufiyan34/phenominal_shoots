# What was fixed — Phenomenal Shoots

## 1. Build-breaking bug (root cause of the Vercel failure)

`components/admin/ProjectsManager.tsx` was leftover code from before the
project's admin CRUD screens were unified under the generic `CmsManager`
component (the same one that already powers Packages, Stories, Promotions,
Services, Testimonials and FAQ). It imported `createProject` / `deleteProject`
from `lib/repositories.ts`, but those were never exported — `repositories.ts`
only has the generic `saveItem` / `deleteItem` / `listCollection` functions
plus `listProjects`.

The file was never imported anywhere (`app/admin/projects/page.tsx` and
`app/admin/projects/new/page.tsx` both already use `CmsManager`), so it was
dead, inconsistent code, not a screen anyone was using.

**Fix applied:** delete `components/admin/ProjectsManager.tsx` entirely.

```bash
rm components/admin/ProjectsManager.tsx
```

After removing it, `npx tsc --noEmit` and `npm run build` both complete
cleanly (verified locally end-to-end).

## 2. Security: real secrets committed in `.env.example`

`.env.example` — the file meant to be a safe, git-tracked template — contains
your **real** Firebase Admin service-account private key, Cloudinary API
secret/key, and Firebase web config, not placeholders. `.gitignore` excludes
`.env` and `.env.local`, but not `.env.example`, so if this file was pushed to
`github.com/sufiyan34/phenominal_shoots`, those credentials are exposed in
your git history right now regardless of whether you fix the file going
forward.

**Do this immediately, independent of anything else here:**
1. In the Firebase console, delete the current Admin SDK service-account key
   tied to `firebase-adminsdk-fbsvc@...` and generate a new one.
2. In the Cloudinary console, regenerate the API secret (and API key, to be
   safe) for that account.
3. Update `.env.local` (not `.env.example`) with the new values — `.env.local`
   is correctly gitignored and was not exposed.
4. Replace `.env.example` with the placeholder version included here, then
   commit that.
5. If the GitHub repo has ever been public, treat the old key/secret as
   permanently compromised even after rotating — consider scrubbing it from
   git history too (e.g. `git filter-repo`), since old commits still contain it.

The replacement `.env.example` in this folder has placeholders only.

## 3. Runtime error: "Missing `<html>` and `<body>` tags in the root layout"

`app/layout.tsx` never rendered `<html>`/`<body>` at all — it just returned
`<AuthProvider><Header/>{children}<Footer/></AuthProvider>` directly. The
Next.js App Router requires the root layout to render those two tags itself;
every other layout in the tree nests inside them, but the outermost one has
to provide them. `next build` doesn't catch this (it's a rendering-time
check, not a type or compile error), which is why it slipped through the
build fix above — I only caught it by actually starting the server and
curling a page.

**Fix applied:**

```tsx
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><Header/>{children}<Footer/></AuthProvider>
      </body>
    </html>
  );
}
```

Verified with `next build` + `next start` — the served HTML now correctly
starts with `<!DOCTYPE html><html lang="en">...<body>...`.

## 5. Runtime: "Missing or insufficient permissions" on every project/package/story/promotion detail page

`lib/publicData.ts`'s `getPublishedBySlug()` queried Firestore by `slug` only,
then filtered for `status === "published"` **after** the results came back
client-side:

```ts
const snap = await getDocs(query(collection(db, name), where("slug", "==", slug), limit(5)));
const d = snap.docs.find((item) => item.data().status === "published");
```

Your `firestore.rules` only allow a non-admin to read a doc when
`resource.data.status == "published"`. For a `list`/query request (as
opposed to reading one known doc by ID), Firestore's rules engine has to
verify the rule is satisfiable for the query **as written** — and since the
query itself never filters on `status`, it can't guarantee that, so it
rejects the whole query with "Missing or insufficient permissions," even
when the matching document genuinely is published. This hit every detail
page that uses this helper: `/projects/[slug]`, `/packages/[slug]`,
`/stories/[slug]`, and `/promotions/[slug]`.

**Fix applied** — filter by `status` in the query itself, so it lines up
with the security rule (no composite index needed; Firestore merges
single-field indexes for pure-equality queries like this one):

```ts
export async function getPublishedBySlug<T>(name: string, slug: string) {
  const snap = await getDocs(query(collection(db, name), where("slug", "==", slug), where("status", "==", "published"), limit(5)));
  const d = snap.docs[0];
  return d ? ({ id: d.id, ...d.data() } as T) : null;
}
```

## 6. Minor: "Missing `data-scroll-behavior`" warning

`app/globals.css` sets `html { scroll-behavior: smooth; }`. Next's App
Router router flagged this because it can interfere with scroll restoration
during route transitions. Applied Next's own suggested fix — added
`data-scroll-behavior="smooth"` to the `<html>` tag in `app/layout.tsx` — no
functional change, just silences the warning.

## 7. Demo projects for Firebase

`scripts/seed-demo-projects.js` — a standalone Node script (uses the
`firebase-admin` dependency already in `package.json`, plus `@next/env` to
load `.env.local` the same way Next.js does) that writes 5 demo entries into
your Firestore `projects` collection: reuses the same placeholder titles,
categories, locations and Unsplash photo URLs already shipped in
`data/mock.ts`, so nothing new/unverified is introduced.

Copy it into your project's `scripts/` folder, add this line to
`package.json`'s `"scripts"`:

```json
"seed:projects": "node scripts/seed-demo-projects.js"
```

then, **after you've rotated the credentials in step 2**, run:

```bash
npm run seed:projects
```

It's safe to re-run — each demo project uses its slug as the Firestore
document ID, so re-running overwrites the same 5 docs instead of duplicating
them. Four are seeded as `published` (visible on `/projects` right away) and
one as `draft` (visible only in the admin CRUD), so you can see both states.

These are placeholder photos/copy, same as the rest of the mock content —
swap them for real shoots before launch, as your own README/FINAL-STATUS.md
already note.
