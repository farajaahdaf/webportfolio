import "server-only";
import { NextResponse } from "next/server";
import { readCollection, writeCollection, generateId } from "./db";
import { requireAdmin } from "./auth";
import type { DbSchema } from "./types";
import { slugify } from "./utils";

type WithId = { id: string };
type WithSlug = { slug?: string; title?: string; name?: string };

export function crudHandlers<K extends keyof DbSchema>(
  collection: K,
  options: { idPrefix?: string; slugFromField?: "title" | "name" } = {}
) {
  const { idPrefix = collection.slice(0, 3), slugFromField } = options;

  return {
    async GET() {
      try {
        await requireAdmin();
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const items = (await readCollection(collection)) as unknown as Array<
        Record<string, unknown>
      >;
      return NextResponse.json({ items });
    },

    async POST(req: Request) {
      try {
        await requireAdmin();
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const body = (await req.json()) as Record<string, unknown>;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
      }
      const items = (await readCollection(collection)) as unknown as Array<
        WithId & WithSlug & Record<string, unknown>
      >;
      const now = new Date().toISOString();
      const input = { ...body };
      delete input.id;
      delete input.createdAt;
      delete input.updatedAt;
      const next = {
        ...input,
        id: generateId(idPrefix),
        createdAt: now,
        updatedAt: now,
      } as WithId & WithSlug & Record<string, unknown>;
      if (slugFromField && !next.slug) {
        const base = String(body[slugFromField] || "untitled");
        let s = slugify(base);
        let n = 1;
        while (items.some((it) => it.slug === s)) {
          s = `${slugify(base)}-${n++}`;
        }
        next.slug = s;
      }
      items.push(next);
      await writeCollection(collection, items as DbSchema[K]);
      return NextResponse.json({ item: next });
    },

    async PUT(req: Request) {
      try {
        await requireAdmin();
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const body = (await req.json()) as Record<string, unknown> & { id?: string };
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
      }
      if (!body.id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }
      const items = (await readCollection(collection)) as unknown as Array<
        WithId & Record<string, unknown>
      >;
      const idx = items.findIndex((it) => it.id === body.id);
      if (idx < 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const input = { ...body };
      delete input.createdAt;
      delete input.updatedAt;
      items[idx] = {
        ...items[idx],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      await writeCollection(collection, items as DbSchema[K]);
      return NextResponse.json({ item: items[idx] });
    },

    async DELETE(req: Request) {
      try {
        await requireAdmin();
      } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
      }
      const items = (await readCollection(collection)) as unknown as Array<WithId>;
      const next = items.filter((it) => it.id !== id);
      await writeCollection(collection, next as DbSchema[K]);
      return NextResponse.json({ ok: true });
    },
  };
}
