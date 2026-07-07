# Faraja Ahdaf, Portfolio + Admin CMS

A premium personal portfolio for a Fullstack Developer & AI Engineer, plus a built-in admin CMS for managing projects, posts, skills, experience, certificates, and social links.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **shadcn-style UI**. Content is persisted in a small Neon/Postgres JSONB key-value table.

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
# Edit AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL, and BLOB_READ_WRITE_TOKEN

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
| Storage | Neon/Postgres JSONB KV table |
| Theming | next-themes |
| Toast | sonner |

## Project structure

```
.
├── data/                      # Seed data for Neon/Postgres
│   ├── projects.json
│   ├── posts.json
│   ├── skills.json
│   ├── experience.json
│   ├── certificates.json
│   ├── socials.json
│   └── users.json             # empty by default; admin bootstraps from env
├── public/                    # static assets
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

Each collection has a TypeScript type in `src/lib/types.ts` and seed JSON in `data/`. The CMS reads and writes Neon/Postgres through REST routes (`/api/projects`, `/api/posts`, etc.). All CRUD routes require an authenticated admin cookie.

Seed Neon from local JSON data with:

```bash
node --env-file=.env.local scripts/seed.mjs
```

Reset the admin user with:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strong-password' node --env-file=.env.local scripts/reset-admin.mjs
```

## Customizing

- **Replace placeholder content** in the CMS at `/admin`, or update `data/*.json` and re-run the seed script.
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

For Vercel: import the repo, provision Neon and Vercel Blob, set the env vars from `.env.example`, seed content, and ship.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run the dev server on <http://localhost:3000> |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript noEmit check |
| `node --env-file=.env.local scripts/seed.mjs` | Push `data/*.json` to Neon |
| `node --env-file=.env.local scripts/pull.mjs` | Pull Neon data into `data/*.json` |
| `node --env-file=.env.local scripts/reset-admin.mjs` | Reset admin password |

## License

MIT, yours to use, fork, and remix.
