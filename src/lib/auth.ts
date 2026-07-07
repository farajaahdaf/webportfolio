import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { readCollection, writeCollection, generateId } from "./db";
import type { User } from "./types";

const COOKIE = "fa_session";
const rawSecret = process.env.AUTH_SECRET;

if (!rawSecret || rawSecret.length < 32) {
  throw new Error("AUTH_SECRET must be set to a 32+ character random string.");
}

const SECRET = new TextEncoder().encode(rawSecret);
const ALG = "HS256";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  uid: string;
  email: string;
  name: string;
  role: "admin";
};

async function sign(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

async function verify(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

async function ensureBootstrapUser(): Promise<User[]> {
  const users = await readCollection("users");
  if (users.length > 0) return users;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to bootstrap admin.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const seeded: User = {
    id: generateId("usr"),
    email,
    name: "Faraja Ahdaf",
    role: "admin",
    passwordHash,
  };
  await writeCollection("users", [seeded]);
  return [seeded];
}

export async function login(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = await ensureBootstrapUser();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, error: "Invalid credentials" };
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Invalid credentials" };
  const token = await sign({
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return { ok: true };
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return s;
}
