// Seed Neon (kv table) from the existing data/*.json files.
//
// Usage (Node 20+ loads .env.local for DATABASE_URL):
//   node --env-file=.env.local scripts/seed.mjs
//
// Idempotent: re-running overwrites each key with the current JSON file.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error(
    "Missing DATABASE_URL. Run: node --env-file=.env.local scripts/seed.mjs"
  );
  process.exit(1);
}

const sql = neon(connectionString);

// key -> json file. Arrays for collections, object for settings.
const SOURCES = {
  projects: "projects.json",
  posts: "posts.json",
  skills: "skills.json",
  experience: "experience.json",
  certificates: "certificates.json",
  socials: "socials.json",
  users: "users.json",
  settings: "settings.json",
};

async function loadJson(file) {
  try {
    const raw = await readFile(path.join(dataDir, file), "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS kv (
      key  TEXT PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '[]'::jsonb
    )
  `;

  for (const [key, file] of Object.entries(SOURCES)) {
    const value = await loadJson(file);
    if (value === null) {
      console.log(`- skip ${key} (no ${file})`);
      continue;
    }
    await sql`
      INSERT INTO kv (key, data)
      VALUES (${key}, ${JSON.stringify(value)}::jsonb)
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data
    `;
    const count = Array.isArray(value) ? `${value.length} items` : "object";
    console.log(`+ seeded ${key} (${count})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
