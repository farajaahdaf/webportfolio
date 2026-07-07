import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readCollection } from "@/lib/db";

type Hit = {
  collection:
    | "projects"
    | "posts"
    | "skills"
    | "experience"
    | "certificates"
    | "socials";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  snippet?: string;
};

function snippet(text: string, q: string, max = 140): string | undefined {
  if (!text) return undefined;
  const lower = text.toLowerCase();
  const i = lower.indexOf(q);
  if (i < 0) return text.slice(0, max).trim();
  const start = Math.max(0, i - 40);
  const end = Math.min(text.length, i + q.length + max - 40);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}

function match(haystack: unknown, q: string): boolean {
  if (typeof haystack === "string") return haystack.toLowerCase().includes(q);
  if (Array.isArray(haystack)) return haystack.some((x) => match(x, q));
  return false;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const raw = (searchParams.get("q") || "").trim().toLowerCase();
  if (!raw) return NextResponse.json({ hits: [] });

  const [projects, posts, skills, experience, certificates, socials] =
    await Promise.all([
      readCollection("projects"),
      readCollection("posts"),
      readCollection("skills"),
      readCollection("experience"),
      readCollection("certificates"),
      readCollection("socials"),
    ]);

  const hits: Hit[] = [];

  for (const p of projects) {
    const fields = [p.title, p.slug, p.tagline, p.description, p.content, p.category, p.tech.join(" ")];
    if (fields.some((f) => match(f, raw))) {
      hits.push({
        collection: "projects",
        id: p.id,
        title: p.title,
        subtitle: `${p.category} · ${p.status}`,
        href: "/admin/projects",
        snippet: snippet(p.description || p.tagline, raw),
      });
    }
  }

  for (const p of posts) {
    const fields = [p.title, p.slug, p.excerpt, p.content, p.category, p.tags.join(" ")];
    if (fields.some((f) => match(f, raw))) {
      hits.push({
        collection: "posts",
        id: p.id,
        title: p.title,
        subtitle: `${p.category} · ${p.status}`,
        href: "/admin/posts",
        snippet: snippet(p.excerpt || p.content, raw),
      });
    }
  }

  for (const s of skills) {
    if (match(s.name, raw) || match(s.category, raw)) {
      hits.push({
        collection: "skills",
        id: s.id,
        title: s.name,
        subtitle: `${s.category} · ${s.proficiency}%`,
        href: "/admin/skills",
      });
    }
  }

  for (const e of experience) {
    const fields = [e.role, e.organization, e.type, e.location, e.description, e.achievements.join(" "), (e.tech || []).join(" ")];
    if (fields.some((f) => match(f, raw))) {
      hits.push({
        collection: "experience",
        id: e.id,
        title: e.role,
        subtitle: `${e.organization} · ${e.type}`,
        href: "/admin/experience",
        snippet: snippet(e.description, raw),
      });
    }
  }

  for (const c of certificates) {
    if (match(c.title, raw) || match(c.issuer, raw) || match(c.skills, raw)) {
      hits.push({
        collection: "certificates",
        id: c.id,
        title: c.title,
        subtitle: c.issuer,
        href: "/admin/certificates",
      });
    }
  }

  for (const s of socials) {
    if (match(s.platform, raw) || match(s.url, raw) || match(s.handle || "", raw)) {
      hits.push({
        collection: "socials",
        id: s.id,
        title: s.platform,
        subtitle: s.handle || s.url,
        href: "/admin/socials",
      });
    }
  }

  return NextResponse.json({ hits: hits.slice(0, 30) });
}
