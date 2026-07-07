"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/section-header";
import { fadeUp, stagger } from "@/lib/motion";
import { formatDate, readingTime } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function BlogPreview({ posts }: { posts: Post[] }) {
  const published = posts
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <section id="blog" className="relative py-32">
      <div className="container-prose">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Writing"
            title="Notes from the field."
            description="Field notes on engineering, AI research, and craft."
          />
          <Button asChild variant="outline" className="rounded-full self-start md:self-end">
            <Link href="/blog">
              All posts <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {published.map((p) => (
            <motion.article
              key={p.id}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-foreground/25 hover:shadow-md"
            >
              <Link href={`/blog/${p.slug}`} className="block">
                {p.cover && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                    <Badge variant="glass" className="absolute left-4 top-4">
                      {p.category}
                    </Badge>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(p.publishedAt || p.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {readingTime(p.content)} min read
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
