# Supabase Migration Verification

Verified on 2026-07-13 before the Vercel production cutover.

## Data Parity

The migration read the active Neon `kv` table immediately before copying it,
performed the Supabase truncate and inserts in one transaction, then compared
canonical SHA-256 digests without printing row contents.

| Key | JSON type | Items | Digest match |
|---|---:|---:|---:|
| certificates | array | 2 | yes |
| experience | array | 1 | yes |
| posts | array | 3 | yes |
| projects | array | 4 | yes |
| settings | object | - | yes |
| skills | array | 14 | yes |
| socials | array | 4 | yes |
| users | array | 0 | yes |

The Indonesian settings copy was persisted under `settings.translations.id` and
verified with a remote JSON path query before the source fallback was removed.

Parity was checked again immediately before deployment and after the production
alias moved to the Supabase-backed deployment. All eight source keys still
matched, closing the cutover write window without a missed Neon update.

## Schema and Security

- Local and remote migration history both contain `20260713022827`.
- RLS is enabled on `public.kv`.
- `anon`, `authenticated`, and `service_role` have no table privileges.
- Supabase security advisor: no warning/error findings.
- Supabase performance advisor: no warning/error findings.

## Application

- `npm run lint`: passed.
- `npm run type-check`: passed.
- Production build against the transaction pooler: passed.
- Vercel production-environment build: passed.
- Parameterized JSON write/read/delete smoke test: passed with no residual row.
- Production deployment `dpl_RqKpYoFkB38oeuGNfZCEaaubafCq`: Ready.
- Dynamic Functions run in Vercel region `sin1`.
- Public site loaded database content; `/admin` redirected to `/admin/login`.
- Production error logs after smoke requests: no errors found.
- `npm audit --omit=dev`: no high or critical findings; two moderate findings
  remain in Next.js's PostCSS dependency with no non-breaking fix available.

## Rollback

The previous Neon environment variables remain in Vercel but are no longer read
by application code. A rollback can restore the previous deployment and change
`DATABASE_URL` back to the Neon value. Supabase data should be preserved during
rollback for later reconciliation.
