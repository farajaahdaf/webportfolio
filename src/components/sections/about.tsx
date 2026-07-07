"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Brain,
  Cpu,
  Server,
  Layers,
  Cloud,
  Microscope,
  type LucideIcon,
  Sparkles,
  Award,
  Briefcase,
  FlaskConical,
  Database,
  Rocket,
} from "lucide-react";
import { SectionHeader } from "@/components/site/section-header";
import { Counter } from "@/components/site/counter";
import { fadeUp, stagger } from "@/lib/motion";
import type { SiteSettings } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Brain,
  Cpu,
  Server,
  Layers,
  Cloud,
  Microscope,
  Sparkles,
  Award,
  Briefcase,
  FlaskConical,
  Database,
  Rocket,
};

export function About({
  settings,
  completedProjectsCount,
  technologiesCount,
}: {
  settings: SiteSettings;
  completedProjectsCount: number;
  technologiesCount: number;
}) {
  const { about } = settings;

  const stats = [
    { label: "Years experience", value: about.stats.yearsExperience, suffix: "+" },
    { label: "Projects completed", value: completedProjectsCount, suffix: "" },
    { label: "Technologies mastered", value: technologiesCount, suffix: "" },
    { label: "Research & experiments", value: about.stats.researchCount, suffix: "" },
  ];

  return (
    <section id="about" className="relative py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {about.expertise.map((e) => {
            const Icon = iconMap[e.icon] || Sparkles;
            return (
              <motion.div
                key={e.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-foreground/25 hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary transition-colors group-hover:border-foreground/30 group-hover:text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {e.blurb}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:grid-cols-4 md:p-10"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`relative ${i > 0 ? "md:border-l md:border-border md:pl-8" : ""}`}
            >
              <div className="font-display text-4xl font-semibold tracking-tight text-gradient-static md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
