"use client";

import { motion, type Variants } from "framer-motion";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const tags = {
  div: motion.div,
  article: motion.article,
  a: motion.a,
} as const;

type Tag = keyof typeof tags;

type CardShellOwnProps = {
  as?: Tag;
  /** Renders a top accent bar that fades in on hover (used by the about/certificates cards). */
  accent?: boolean;
  padding?: string;
  /** framer-motion variants, e.g. fadeUp from @/lib/motion, for cards inside a stagger container. */
  variants?: Variants;
  className?: string;
  children: ReactNode;
};

type CardShellProps = CardShellOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CardShellOwnProps>;

/**
 * Shared hover-state card shell (border/radius/shadow + hover transition), duplicated
 * verbatim across the about, certificates, blog-preview, skills, and contact sections.
 * Layout concerns (relative/overflow-hidden, flex, etc.) stay in each caller's className
 * since they vary per section.
 */
export function CardShell({
  as = "div",
  accent = false,
  padding = "",
  variants,
  className,
  children,
  ...rest
}: CardShellProps) {
  const Comp = tags[as] as ElementType;
  return (
    <Comp
      variants={variants}
      className={cn(
        "group rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] [transition-duration:200ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/25 hover:shadow-md",
        padding,
        className
      )}
      {...rest}
    >
      {accent && (
        <div className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      {children}
    </Comp>
  );
}
