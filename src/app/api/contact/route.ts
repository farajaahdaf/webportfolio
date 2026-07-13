import { NextResponse } from "next/server";
import { readKV, writeKV } from "@/lib/db";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const CONTACT_KEY = "contact";
const MAX_MESSAGES = 500;

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
};

export async function POST(req: Request) {
  if (process.env.CONTACT_WRITES_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Contact form is unavailable in this environment" },
      { status: 503 }
    );
  }

  try {
    const limit = checkRateLimit(`contact:${clientIp(req)}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (limit.limited) {
      return NextResponse.json(
        { error: "Too many messages" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await req.json();
    const { name, email, subject, message } = body || {};
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if ([name, email, subject, message].some((v) => typeof v !== "string")) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }
    const existing = await readKV<ContactMessage[]>(CONTACT_KEY, []);
    existing.push({
      id: `msg_${Date.now().toString(36)}`,
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      subject: String(subject).slice(0, 200),
      message: String(message).slice(0, 5000),
      receivedAt: new Date().toISOString(),
    });
    await writeKV(CONTACT_KEY, existing.slice(-MAX_MESSAGES));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
