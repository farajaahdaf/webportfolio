"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
import { CardShell } from "@/components/site/card-shell";
import { Counter } from "@/components/site/counter";
import { fadeUp, stagger } from "@/lib/motion";
import { expertiseIcons, iconFor } from "@/lib/icons";
import type { SiteSettings } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

export function About({
  settings,
  completedProjectsCount,
  technologiesCount,
  locale = "en",
}: {
  settings: SiteSettings;
  completedProjectsCount: number;
  technologiesCount: number;
  locale?: Locale;
}) {
  const { about } = settings;
  const t = dictionary[locale];

  const stats = [
    { label: t.about.yearsExperience, value: about.stats.yearsExperience, suffix: "+" },
    { label: t.about.projectsCompleted, value: completedProjectsCount, suffix: "" },
    { label: t.about.technologiesMastered, value: technologiesCount, suffix: "" },
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
          {about.expertise.map((e, i) => {
            const Icon = iconFor(expertiseIcons, e.icon, Sparkles);
            return (
              <CardShell key={i} variants={fadeUp} padding="p-6" className="relative overflow-hidden" accent>
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
              </CardShell>
            );
          })}
        </motion.div>

        <Reveal className="mt-16 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-3 md:p-10">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`relative ${i > 0 ? "sm:border-l sm:border-border sm:pl-8" : ""}`}
            >
              <div className="font-display text-4xl font-semibold tracking-tight text-gradient-static md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
