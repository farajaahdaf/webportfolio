# Faraja Ahdaf, Portfolio + Admin CMS

A premium personal portfolio for a Fullstack Developer & AI Engineer, plus a built-in admin CMS for managing projects, posts, skills, experience, certificates, and social links.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **shadcn-style UI**. Content is persisted in a private Supabase Postgres JSONB key-value table.

## Highlights

- Premium dark-first design, glassmorphism, soft neon glow, dynamic gradients
- Smooth scroll, scroll-triggered animations, animated cursor, magnetic CTAs
- Hero, About, Skills, Featured Projects, Experience timeline, Blog, Contact
- Project detail pages with case-study Markdown
- Blog with search, categories, tags, syntax highlighting, reading time
- Loading screen, 404 page, SEO metadata, OpenGraph, sitemap, robots.txt
- Built-in `/admin` CMS, JWT cookie auth, dashboard analytics, full CRUD
- Responsive mobile-first, accessibility-conscious, Lighthouse-friendly

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL, and BLOB_READ_WRITE_TOKEN.
# DATABASE_URL must use the Supabase transaction pooler on port 6543.
# Set CONTACT_WRITES_ENABLED=true only in the Production environment.

# 3. Run dev server
npm run dev
```

Open <http://localhost:3000>.

To enter the CMS go to <http://localhost:3000/admin>. The first admin user is bootstrapped from `ADMIN_EMAIL` and `ADMIN_PASSWORD` when no user exists yet.

> `AUTH_SECRET` must be a 32+ character random string. Do not deploy with placeholder credentials.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, custom design tokens |
| Animations | Framer Motion |
| UI primitives | Radix UI + shadcn-style components |
| Icons | Lucide |
| Markdown | react-markdown, remark-gfm, rehype-highlight |
| Auth | jose (JWT) + bcryptjs |
| Database | Supabase Postgres 17 via the transaction pooler |
| Upload storage | Vercel Blob |
| Theming | next-themes |
| Toast | sonner |

## Project structure

```
.
├── public/                    # static assets
├── supabase/
│   ├── config.toml            # local Supabase CLI configuration
│   └── migrations/            # versioned database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # home
│   │   ├── projects/          # public projects list + detail
│   │   ├── blog/              # public blog list + detail
│   │   ├── admin/             # full CMS
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   ├── projects/
│   │   │   ├── posts/
│   │   │   ├── skills/
│   │   │   ├── experience/
│   │   │   ├── certificates/
│   │   │   └── socials/
│   │   └── api/               # auth + CRUD endpoints
│   ├── components/
│   │   ├── ui/                # shadcn-style primitives
│   │   ├── site/              # navbar, footer, cursor, etc.
│   │   ├── sections/          # hero, about, skills, projects, etc.
│   │   └── admin/             # admin shell, data list, editors
│   ├── lib/                   # data fetchers, auth, types, utils
│   └── providers/             # theme provider
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

## Content model

Each collection has a TypeScript type in `src/lib/types.ts`. The CMS reads and writes Supabase Postgres through REST routes (`/api/projects`, `/api/posts`, etc.). All CRUD routes require an authenticated admin cookie. Portfolio content exists only in Supabase and is managed through `/admin`.

The schema migration creates an empty `kv` table. A fresh environment must restore or migrate its CMS data before the app starts because the `settings` row is required at runtime; production content is intentionally not stored in Git.

Apply pending schema migrations with:

```bash
npx supabase db push --linked
```

Reset the admin user with:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strong-password' node --env-file=.env.local scripts/reset-admin.mjs
```

## Customizing

- **Manage portfolio content** in the CMS at `/admin`.
- **Swap accent colors** by editing `--primary` / `--accent` HSL values in `src/app/globals.css`.
- **Change fonts** in `src/app/layout.tsx` (`Inter`, `Sora`, `JetBrains_Mono`).
- **Add /resume.pdf** at `public/resume.pdf` so the "Download Resume" CTA works.
- **Drop in an OG image** at `public/og.png` (1200×630).

## Deploying

Any Node host that supports Next.js works. The simplest path:

```bash
npm run build
npm start
```

For Vercel: link the project, set the environment variables from `.env.example`, and deploy. Use the Supabase shared transaction pooler URL on port `6543`; `vercel.json` keeps Functions in Singapore near the database. Keep `CONTACT_WRITES_ENABLED` disabled outside Production when environments share one database.

```bash
vercel env run -e production -- npm run build
vercel deploy --prod
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run the dev server on <http://localhost:3000> |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript noEmit check |
| `npx supabase db push --linked` | Apply pending Supabase migrations |
| `node --env-file=.env.local scripts/reset-admin.mjs` | Reset admin password |

## License

MIT, yours to use, fork, and remix.
