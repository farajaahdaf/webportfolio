"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";
import type { Post } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

export function BlogSearch({
  posts,
  categories,
  locale = "en",
}: {
  posts: Post[];
  categories: string[];
  locale?: Locale;
}) {
  const t = dictionary[locale];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCat = !cat || p.category === cat;
      const matchesQ =
        !needle ||
        p.title.toLowerCase().includes(needle) ||
        p.excerpt.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle));
      return matchesCat && matchesQ;
    });
  }, [q, cat, posts]);

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.blog.searchPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCat(null)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer ${
              cat === null
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.skills.all}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer ${
                cat === c
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          {t.blog.empty}
        </p>
      ) : (
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <motion.li key={p.id} variants={fadeUp}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/25 hover:shadow-md"
              >
                {p.cover && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="motion-hover-project-image object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                    <Badge variant="glass" className="absolute left-4 top-4">
                      {p.category}
                    </Badge>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(p.publishedAt || p.createdAt, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {readingTime(p.content)} {t.blog.min}
                    </span>
                  </div>
                  {p.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
