// Reset the admin user's credentials in Neon (kv 'users' row).
//
// Usage:
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... node --env-file=.env.local scripts/reset-admin.mjs
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!connectionString || !email || !password) {
  console.error("Need DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD.");
  process.exit(1);
}

const sql = neon(connectionString);

function generateId(prefix = "usr") {
  const r = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36);
  return `${prefix}_${t}${r}`;
}

const rows = await sql`SELECT data FROM kv WHERE key = 'users'`;
const users = rows.length ? rows[0].data : [];
const passwordHash = await bcrypt.hash(password, 10);

let user = users[0];
if (user) {
  user.email = email;
  user.passwordHash = passwordHash;
  user.role = "admin";
} else {
  user = { id: generateId("usr"), email, name: "Faraja Ahdaf", role: "admin", passwordHash };
  users.push(user);
}

await sql`
  INSERT INTO kv (key, data)
  VALUES ('users', ${JSON.stringify(users)}::jsonb)
  ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data
`;

console.log(`Admin reset: ${email}`);
