// Pull Neon data into local data/*.json files.
//
// Usage:
//   node --env-file=.env.local scripts/pull.mjs
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error(
    "Missing DATABASE_URL. Run: node --env-file=.env.local scripts/pull.mjs"
  );
  process.exit(1);
}

const sql = neon(connectionString);

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

async function main() {
  for (const [key, file] of Object.entries(SOURCES)) {
    const rows = await sql`SELECT data FROM kv WHERE key = ${key}`;
    const value = rows.length ? rows[0].data : null;
    if (value === null) {
      console.log(`- skip ${key} (no row)`);
      continue;
    }
    const filepath = path.join(dataDir, file);
    await writeFile(filepath, JSON.stringify(value, null, 2) + "\n");
    const count = Array.isArray(value) ? `${value.length} items` : "object";
    console.log(`+ pulled ${key} → ${file} (${count})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
