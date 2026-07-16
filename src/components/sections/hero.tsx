"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowRight,
  Mail,
  Sparkles,
  Brain,
  Cpu,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/site/magnetic";
import type { SiteSettings } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

const techIcons = [
  { Icon: Brain, label: "AI", style: "top-[10%] left-[8%]", delay: 0 },
  { Icon: Cpu, label: "ML", style: "top-[20%] right-[10%]", delay: 0.4 },
  { Icon: BarChart3, label: "Data", style: "bottom-[15%] left-[6%]", delay: 0.8 },
  { Icon: Sparkles, label: "Transformer", style: "bottom-[20%] right-[8%]", delay: 1.2 },
];

const iconForCta = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("resume") || l.includes("cv") || l.includes("download"))
    return ArrowDownToLine;
  if (l.includes("contact") || l.includes("mail") || l.includes("email"))
    return Mail;
  return ArrowRight;
};

export function Hero({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  const { profile, hero } = settings;
  const t = dictionary[locale];
  const shouldReduceMotion = useReducedMotion();
  const titleSegments = profile.title.split("·").map((s) => s.trim()).filter(Boolean);
  const Primary = iconForCta(hero.primaryCta.label);
  const Secondary = iconForCta(hero.secondaryCta.label);
  const Tertiary = iconForCta(hero.tertiaryCta.label);

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 md:pt-40">
      {/* Floating tech icons */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {techIcons.map(({ Icon, label, style, delay }) => (
          <motion.div
            key={label}
            initial={{
              opacity: 0,
              transform: shouldReduceMotion ? "scale(1)" : "scale(0.95)",
            }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.48,
              delay: shouldReduceMotion ? 0 : delay + 0.6,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={`absolute ${style}`}
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? { transform: "translateY(0px)" }
                  : {
                      transform: [
                        "translateY(0px)",
                        "translateY(-14px)",
                        "translateY(0px)",
                      ],
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay,
                    }
              }
              className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="container-prose relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{
              opacity: 0,
              transform: shouldReduceMotion
                ? "translateY(0px)"
                : "translateY(12px)",
            }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.42,
              delay: shouldReduceMotion ? 0 : 0.1,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="mt-6 whitespace-nowrap font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]"
          >
            {profile.name}
          </motion.h1>

          {titleSegments.length > 0 && (
            <motion.p
              initial={{
                opacity: 0,
                transform: shouldReduceMotion
                  ? "translateY(0px)"
                  : "translateY(12px)",
              }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.42,
                delay: shouldReduceMotion ? 0 : 0.25,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-balance"
            >
              {titleSegments.map((seg, i) => (
                <span key={seg} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground">·</span>}
                  <span
                    className={`font-mono text-sm uppercase tracking-[0.2em] ${
                      i === 0
                        ? "text-foreground"
                        : i === 1
                          ? "text-primary"
                          : "text-foreground/70"
                    }`}
                  >
                    {seg}
                  </span>
                </span>
              ))}
            </motion.p>
          )}

          <motion.p
            initial={{
              opacity: 0,
              transform: shouldReduceMotion
                ? "translateY(0px)"
                : "translateY(12px)",
            }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.42,
              delay: shouldReduceMotion ? 0 : 0.4,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              transform: shouldReduceMotion
                ? "translateY(0px)"
                : "translateY(12px)",
            }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.42,
              delay: shouldReduceMotion ? 0 : 0.55,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Magnetic>
              <Button asChild variant="gradient" size="lg" className="rounded-full">
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <Primary className="h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link
                  href={profile.resumeUrl || hero.secondaryCta.href}
                  target={(profile.resumeUrl || hero.secondaryCta.href).startsWith("http") || (profile.resumeUrl || hero.secondaryCta.href).endsWith(".pdf") ? "_blank" : undefined}
                  rel={(profile.resumeUrl || hero.secondaryCta.href).startsWith("http") ? "noreferrer" : undefined}
                >
                  <Secondary className="h-4 w-4" />
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="ghost" size="lg" className="rounded-full">
                <Link href={hero.tertiaryCta.href}>
                  <Tertiary className="h-4 w-4" />
                  {hero.tertiaryCta.label}
                </Link>
              </Button>
            </Magnetic>
          </motion.div>

          {hero.techRibbon.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.42,
                delay: shouldReduceMotion ? 0 : 0.8,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="relative mx-auto mt-20 max-w-3xl"
            >
              <p className="mb-4 text-center text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
                {t.hero.workingWith}
              </p>
              <div className="relative overflow-hidden mask-fade-r">
                <div className="flex animate-marquee gap-12 whitespace-nowrap">
                  {[...hero.techRibbon, ...hero.techRibbon].map((t, i) => (
                    <span
                      key={i}
                      className="font-display text-2xl font-semibold text-muted-foreground/40 transition-colors hover:text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.42,
            delay: shouldReduceMotion ? 0 : 1.2,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t.hero.scroll}
          </span>
          <div className="h-10 w-px overflow-hidden bg-border">
            <motion.div
              animate={
                shouldReduceMotion
                  ? { transform: "translateY(0%)" }
                  : {
                      transform: ["translateY(-100%)", "translateY(100%)"],
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
              className="h-full w-full bg-gradient-to-b from-transparent via-primary to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
