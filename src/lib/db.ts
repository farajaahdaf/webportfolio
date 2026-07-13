import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import type { DbSchema } from "./types";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL. Configure the Supabase transaction pooler connection string."
  );
}

const sql = postgres(connectionString, {
  ssl: {
    ca: readFileSync(path.join(process.cwd(), "certs/supabase-ca.crt"), "utf8"),
    rejectUnauthorized: true,
  },
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

/** Read a JSON value by key, returning `fallback` when the row is absent. */
export async function readKV<T>(key: string, fallback: T): Promise<T> {
  const rows = await sql<{ data: T }[]>`
    select data from public.kv where key = ${key}
  `;
  if (rows.length === 0) return fallback;
  return rows[0].data;
}

/** Upsert a JSON value under key. */
export async function writeKV<T>(key: string, data: T): Promise<void> {
  await sql`
    insert into public.kv (key, data)
    values (${key}, ${sql.json(data as postgres.JSONValue)})
    on conflict (key) do update set data = excluded.data
  `;
}

export async function readCollection<K extends keyof DbSchema>(
  key: K
): Promise<DbSchema[K]> {
  return readKV<DbSchema[K]>(key, [] as unknown as DbSchema[K]);
}

export async function writeCollection<K extends keyof DbSchema>(
  key: K,
  data: DbSchema[K]
): Promise<void> {
  return writeKV<DbSchema[K]>(key, data);
}

export function generateId(prefix = "id"): string {
  const r = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36);
  return `${prefix}_${t}${r}`;
}
