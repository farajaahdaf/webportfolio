"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/section-header";
import { GlowCard } from "@/components/site/glow-card";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/motion";
import { isValidUrl } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const featured = projects.filter((p) => p.featured && p.status === "published");

  return (
    <section id="projects" className="relative py-32">
      <div className="container-prose">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Featured Projects"
            title="Selected work that ships."
            description="A snapshot of recent builds, from AI research to production systems and admin platforms."
          />
          <Button asChild variant="outline" className="rounded-full self-start md:self-end">
            <Link href="/projects">
              View all projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {featured.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <GlowCard className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(p)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <Image
                      src={p.thumbnail}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <Badge variant="glass" className="backdrop-blur-md">
                        {p.category}
                      </Badge>
                      {p.featured && (
                        <Badge variant="default" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white text-foreground shadow-sm transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4 text-foreground" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {p.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.slice(0, 5).map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="rounded-md text-[10px] font-mono uppercase tracking-wider"
                        >
                          {t}
                        </Badge>
                      ))}
                      {p.tech.length > 5 && (
                        <Badge
                          variant="outline"
                          className="rounded-md text-[10px] font-mono"
                        >
                          +{p.tech.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectDialog
        project={active}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </section>
  );
}

function ProjectDialog({
  project,
  onOpenChange,
}: {
  project: Project | null;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        {project && (
          <>
            <div className="relative aspect-[16/8] w-full overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
            </div>
            <div className="p-6 md:p-8">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="glass">{project.category}</Badge>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {project.status}
                  </span>
                </div>
                <DialogTitle className="mt-3 text-2xl md:text-3xl">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-base">
                  {project.tagline}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/80">
                <p>{project.description}</p>
              </div>

              {project.metrics && project.metrics.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border bg-secondary p-4 md:grid-cols-4">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="font-display text-2xl font-semibold text-gradient-static">
                        {m.value}
                      </div>
                      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-md text-[10px] font-mono uppercase tracking-wider">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {isValidUrl(project.liveUrl) && (
                  <Button asChild variant="gradient" className="rounded-full">
                    <Link href={project.liveUrl!} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Live demo
                    </Link>
                  </Button>
                )}
                {isValidUrl(project.githubUrl) && (
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={project.githubUrl!} target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4" />
                      Source code
                    </Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="rounded-full">
                  <Link href={`/projects/${project.slug}`}>
                    Read case study
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
