import { NextResponse } from "next/server";
import { getSettings, writeSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";
import type { SiteSettings } from "@/lib/types";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as SiteSettings;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await writeSettings(body);
  return NextResponse.json({ ok: true });
}
