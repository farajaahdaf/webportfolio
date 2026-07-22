"use client";

import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/section-header";
import { Reveal } from "@/components/site/reveal";
import { experienceTypeIcons } from "@/lib/icons";
import type { Experience as Exp } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { dictionary, type Locale } from "@/lib/i18n";

export function Experience({ items, locale = "en" }: { items: Exp[]; locale?: Locale }) {
  const t = dictionary[locale];
  const sorted = [...items].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <section id="experience" className="relative py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow={t.experience.eyebrow}
          title={t.experience.title}
          description={t.experience.description}
        />

        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2" />

          <ul className="space-y-10">
            {sorted.map((exp, i) => {
              const Icon = experienceTypeIcons[exp.type];
              const flip = i % 2 === 1;
              return (
                <Reveal
                  as="li"
                  key={exp.id}
                  delay={0.05 * i}
                  viewportMargin="-80px"
                  className="relative grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {/* Dot */}
                  <div className="absolute left-4 top-2 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="relative">
                      <span className="relative block h-3 w-3 rounded-full border border-primary bg-primary" />
                    </div>
                  </div>

                  <div
                    className={`pl-10 md:pl-0 ${flip ? "md:col-start-2 md:pl-16" : "md:pr-16 md:text-right"}`}
                  >
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 shadow-sm`}
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {exp.type}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/80">
                      {exp.organization}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {formatDate(exp.startDate, locale)} -{" "}
                      {exp.current ? t.experience.present : exp.endDate ? formatDate(exp.endDate, locale) : ""}
                    </p>
                  </div>

                  <div className={`pl-10 md:pl-0 ${flip ? "md:col-start-1 md:row-start-1 md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>
                      {exp.achievements.length > 0 && (
                        <ul className={`mt-3 space-y-1.5 text-sm text-foreground/80 ${flip ? "md:text-right" : ""}`}>
                          {exp.achievements.map((a, j) => (
                            <li key={j} className="flex gap-2">
                              <span className="mt-1 inline-block h-1 w-1 rounded-full bg-primary" />
                              <span className="flex-1">{a}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.tech && exp.tech.length > 0 && (
                        <div className={`mt-4 flex flex-wrap gap-1.5 ${flip ? "md:justify-end" : ""}`}>
                          {exp.tech.map((t) => (
                            <Badge
                              key={t}
                              variant="outline"
                              className="rounded-md text-[10px] font-mono uppercase tracking-wider"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
