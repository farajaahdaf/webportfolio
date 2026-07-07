import "server-only";
import { neon } from "@neondatabase/serverless";
import type { DbSchema } from "./types";

// Neon serverless driver (HTTP). Works in Vercel Functions / Fluid Compute.
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

if (!connectionString) {
  // Fail fast in a clear way instead of a cryptic driver error at query time.
  throw new Error(
    "Missing DATABASE_URL. Provision Neon (Vercel Marketplace) and run `vercel env pull .env.local`."
  );
}

const sql = neon(connectionString);

// All persisted state lives in a single JSONB key-value table. Each collection
// (projects, posts, ...) and singleton (settings, contact) is one row whose
// `data` column holds the full JSON value — mirroring the old read-whole-file /
// write-whole-file semantics so the rest of the app is unchanged.
let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS kv (
          key  TEXT PRIMARY KEY,
          data JSONB NOT NULL DEFAULT '[]'::jsonb
        )
      `;
    })().catch((err) => {
      // Reset so a transient failure can be retried on the next call.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

/** Read a JSON value by key, returning `fallback` when the row is absent. */
export async function readKV<T>(key: string, fallback: T): Promise<T> {
  await ensureSchema();
  const rows = (await sql`SELECT data FROM kv WHERE key = ${key}`) as Array<{
    data: T;
  }>;
  if (rows.length === 0) return fallback;
  return rows[0].data;
}

/** Upsert a JSON value under key. */
export async function writeKV<T>(key: string, data: T): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO kv (key, data)
    VALUES (${key}, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data
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
