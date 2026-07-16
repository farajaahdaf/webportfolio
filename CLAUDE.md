# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Faraja Ahdaf's portfolio site + admin CMS. Next.js 16 App Router, TypeScript, Tailwind. Content (projects, posts, skills, experience, certificates, socials, settings) is stored in Supabase Postgres and edited through a self-hosted `/admin` CMS — there is no external headless CMS.

## Commands

```bash
npm run dev          # start dev server (Turbopack)
npm run build         # production build
npm run start         # run production build
npm run lint          # eslint .
npm run type-check    # tsc --noEmit
```

There is no test suite/framework configured in this repo.

Admin bootstrap/reset (bypasses the app, writes straight to the DB — needs `certs/supabase-ca.crt` and `DATABASE_URL`):

```bash
ADMIN_EMAIL=... ADMIN_PASSWORD=... node --env-file=.env.local scripts/reset-admin.mjs
```

## Data layer: single JSONB `kv` table

All persistence goes through one Postgres table, `public.kv (key text primary key, data jsonb)` (see `supabase/migrations/`). There are no per-collection SQL tables — each collection is one JSON row:

- `src/lib/db.ts` — `readKV`/`writeKV` (raw key/value) and `readCollection`/`writeCollection` (typed via `DbSchema` in `src/lib/types.ts`). Uses the `postgres` package with the Supabase transaction pooler, pinned to `certs/supabase-ca.crt`, `max: 1` connection (serverless-friendly).
- `src/lib/data.ts` — read-only accessors for the public site (`getPublishedProjects`, `getSkills`, etc.).
- `src/lib/settings.ts` — the `settings` row is a singleton (`SiteSettings` in `types.ts`), not an array.
- `src/lib/crud.ts` — `crudHandlers(collection, opts)` generates GET/POST/PUT/DELETE for a `DbSchema` key in one call. Every `src/app/api/{collection}/route.ts` (projects, posts, skills, experience, certificates, socials) is just re-exporting this factory's methods — add a new admin-editable collection by adding a key to `DbSchema` and calling `crudHandlers` again, not by hand-writing REST logic. Every method except public GETs calls `requireAdmin()` first.

Row IDs (`generateId`), slugs (auto-derived from `title`/`name` on create via `slugFromField`), and `createdAt`/`updatedAt` are all handled inside `crudHandlers` — don't set them from the client.

## i18n: dictionary + per-record translation overlay

Two independent localization mechanisms, both driven by `Locale = "en" | "id"` (`src/lib/i18n.ts`):

1. **Static UI strings** — `dictionary.en` / `dictionary.id` in `src/lib/i18n.ts`, looked up as `dictionary[locale]`.
2. **DB content translations** — any record (`Project`, `Post`, `Skill`, `Experience`, `Certificate`, `SiteSettings`) can carry an optional `translations: { [locale]: DeepPartial<Omit<T, "translations">> }`. `localizeRecord`/`localizeProject`/`localizeSettings`/etc. deep-merge `translations[locale]` onto the base (English) record via `deepMerge`. **`deepMerge` replaces arrays wholesale — it does not merge array items index-by-index or by id.** So `translations.id.about.expertise` must be a full replacement array, not a sparse patch.

Locale is stored in a plain cookie (`portfolio_locale`, `src/lib/locale.ts`), read server-side in `getLocale()`. There is no `middleware.ts` — every page/layout calls `getLocale()` itself. `src/app/page.tsx` fetches all collections + settings once, then localizes each with the `localize*` helpers before passing to section components. `src/components/site/language-switcher.tsx` switches locale by POSTing `/api/locale` then calling `router.refresh()` — this re-renders server components in place, it is **not** a full page navigation.

**Gotcha (already bit us once):** because `router.refresh()` re-renders in place, any list mapped from localized content must use a locale-**stable** React `key` (index, id, or icon slug) — never the translated text itself (e.g. `key={item.title}`). A key that changes across locales forces React to remount that node, and if it's wrapped in framer-motion's `whileInView`/`viewport={{ once: true }}`, the remounted node never replays its entrance animation and gets stuck at its hidden/`opacity:0` state — looking like content "disappeared" on language switch.

## Auth

`src/lib/auth.ts`: JWT (jose, HS256) in an httpOnly cookie (`fa_session`), 7-day expiry, secret from `AUTH_SECRET` (must be ≥32 chars, checked at import time). Single admin user, lazily bootstrapped from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars the first time `login()` runs and the `users` collection is empty — there's no signup flow. `requireAdmin()` is the guard every mutating API route and admin page relies on; it throws, callers catch and return 401. `src/app/admin/layout.tsx` renders children directly (no `AdminShell` chrome) when there's no session, letting `/admin/login` render unstyled while gating everything else.

## Uploads

`src/lib/storage.ts` uploads to a Supabase Storage bucket named `uploads` via the service-role client (`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`). `src/app/api/upload/route.ts` is the only entry point: admin-gated, 20MB cap, mime-type allowlist (pdf/png/jpeg/webp/gif). The site migrated off Vercel Blob to this Supabase-backed flow — see `docs/supabase-migration-verification.md` for the cutover record (Neon env vars are still present in Vercel for rollback but are dead code).

## Section visibility & admin structure

`settings.sections` (booleans per section) + `src/lib/sections.ts#isSectionVisible` gate which homepage sections `src/app/page.tsx` renders — toggled from the admin settings page, not a code change.

Admin CMS follows one repeated pattern per collection: `src/app/admin/{collection}/page.tsx` (server, fetches via `readCollection`/`getSession`) + `{collection}-manager.tsx` (client component, calls the collection's CRUD API routes). Follow this pairing when adding a new manageable collection.

## Deployment

Vercel, pinned to region `sin1` (`vercel.json`). `src/app/page.tsx` is `export const dynamic = "force-dynamic"` so CMS edits appear immediately without redeploying. Contact form writes are gated behind `CONTACT_WRITES_ENABLED` (disabled by default) and rate-limited in-memory per Vercel function instance in `src/lib/rate-limit.ts`.
