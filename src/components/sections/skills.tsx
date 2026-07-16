"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/site/section-header";
import { TechIcon } from "@/components/site/tech-icon";
import { fadeUp, stagger } from "@/lib/motion";
import type { Skill } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

type Props = { skills: Skill[]; locale?: Locale };

const categories: Skill["category"][] = [
  "Frontend",
  "Backend",
  "AI/ML",
  "Database",
  "DevOps",
  "Tools",
];

export function Skills({ skills, locale = "en" }: Props) {
  const t = dictionary[locale];
  const grouped: Record<string, Skill[]> = Object.fromEntries(
    categories.map((c) => [c, skills.filter((s) => s.category === c)])
  );

  return (
    <section id="skills" className="relative py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          description={t.skills.description}
        />

        <div className="mt-14">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="mx-auto flex h-auto w-full max-w-5xl flex-wrap justify-center gap-2 rounded-2xl p-2">
              <TabsTrigger value="All" className="rounded-xl px-5 py-2.5 text-base">
                {t.skills.all}
              </TabsTrigger>
              {categories.map((c) => (
                <TabsTrigger key={c} value={c} className="rounded-xl px-5 py-2.5 text-base">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="All" className="mt-10">
              <SkillGrid items={skills} emptyLabel={t.skills.empty} />
            </TabsContent>
            {categories.map((c) => (
              <TabsContent key={c} value={c} className="mt-10">
                <SkillGrid items={grouped[c]} emptyLabel={t.skills.empty} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function SkillGrid({ items, emptyLabel = dictionary.en.skills.empty }: { items: Skill[]; emptyLabel?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (!items?.length) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((s) => (
        <motion.div
          key={s.id}
          variants={fadeUp}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/25 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TechIcon
                slug={s.icon}
                color={s.color}
                name={s.name}
                size={22}
                className="h-10 w-10 rounded-xl"
              />
              <div>
                <h3 className="font-display text-sm font-semibold">{s.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {s.category}
                  {s.years ? ` · ${s.years}y` : ""}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {s.proficiency}%
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ transform: shouldReduceMotion ? "scaleX(1)" : "scaleX(0)" }}
              whileInView={{ transform: "scaleX(1)" }}
              viewport={{ once: true }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
              }
              className="h-full rounded-full bg-primary"
              style={{
                width: `${s.proficiency}%`,
                transformOrigin: "left",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
