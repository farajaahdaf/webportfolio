"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: shouldReduceMotion ? "translateY(0px)" : "translateY(12px)",
      }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.42,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 shadow-sm",
            align === "center" && "mx-auto"
          )}
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {title.split(" ").map((word, i, arr) =>
          i === arr.length - 1 ? (
            <span key={i} className="text-gradient-static">
              {" "}
              {word}
            </span>
          ) : (
            <span key={i}>{i > 0 ? " " : ""}{word}</span>
          )
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
