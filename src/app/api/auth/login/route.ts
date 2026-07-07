import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }
    const key = `login:${clientIp(req)}:${String(email).toLowerCase()}`;
    const limit = checkRateLimit(key, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Too many login attempts" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }
    const result = await login(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
