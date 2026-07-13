create table public.kv (
  key text primary key,
  data jsonb not null default '[]'::jsonb
);

alter table public.kv enable row level security;

revoke all on table public.kv from anon, authenticated, service_role;

comment on table public.kv is
  'Server-only CMS storage. Access is restricted to the database connection role.';
