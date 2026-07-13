// Reset the admin user's credentials in the Supabase kv 'users' row.
//
// Usage:
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... node --env-file=.env.local scripts/reset-admin.mjs
import { readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!connectionString || !email || !password) {
  console.error("Need DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD.");
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: {
    ca: readFileSync(path.join(process.cwd(), "certs/supabase-ca.crt"), "utf8"),
    rejectUnauthorized: true,
  },
  max: 1,
  prepare: false,
});

function generateId(prefix = "usr") {
  const r = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36);
  return `${prefix}_${t}${r}`;
}

const rows = await sql`select data from public.kv where key = 'users'`;
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
  insert into public.kv (key, data)
  values ('users', ${sql.json(users)})
  on conflict (key) do update set data = excluded.data
`;

console.log(`Admin reset: ${email}`);
await sql.end();
