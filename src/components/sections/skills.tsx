"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/site/section-header";
import { TechIcon } from "@/components/site/tech-icon";
import { fadeUp, stagger } from "@/lib/motion";
import type { Skill } from "@/lib/types";

type Props = { skills: Skill[] };

const categories: Skill["category"][] = [
  "Frontend",
  "Backend",
  "AI/ML",
  "Database",
  "DevOps",
  "Tools",
];

export function Skills({ skills }: Props) {
  const grouped: Record<string, Skill[]> = Object.fromEntries(
    categories.map((c) => [c, skills.filter((s) => s.category === c)])
  );

  return (
    <section id="skills" className="relative py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow="Skills"
          title="A toolkit, not a stack."
          description="Curated technologies I reach for, chosen for clarity, reliability, and a tight feedback loop."
        />

        <div className="mt-14">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="mx-auto flex flex-wrap justify-center gap-1 rounded-2xl">
              <TabsTrigger value="All" className="rounded-xl">
                All
              </TabsTrigger>
              {categories.map((c) => (
                <TabsTrigger key={c} value={c} className="rounded-xl">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="All" className="mt-10">
              <SkillGrid items={skills} />
            </TabsContent>
            {categories.map((c) => (
              <TabsContent key={c} value={c} className="mt-10">
                <SkillGrid items={grouped[c]} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function SkillGrid({ items }: { items: Skill[] }) {
  if (!items?.length) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No skills in this category yet.
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
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-foreground/25 hover:shadow-md"
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
              initial={{ width: 0 }}
              whileInView={{ width: `${s.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-primary"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
