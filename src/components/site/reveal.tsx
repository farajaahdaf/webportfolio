"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

const tags = {
  div: motion.div,
  form: motion.form,
  h1: motion.h1,
  p: motion.p,
  li: motion.li,
} as const;

type Tag = keyof typeof tags;

type RevealOwnProps = {
  as?: Tag;
  children: ReactNode;
  className?: string;
  /** Animation delay in seconds. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Vertical offset (px) to animate in from. Set 0 for a fade-only reveal. */
  y?: number;
  /** Horizontal offset (px) to animate in from. */
  x?: number;
  /** "view" (default) animates when scrolled into view; "mount" animates immediately, for above-the-fold content. */
  trigger?: "view" | "mount";
  viewportMargin?: string;
};

type RevealProps = RevealOwnProps &
  Omit<
    ComponentPropsWithoutRef<"form">,
    keyof RevealOwnProps | "initial" | "animate" | "whileInView" | "viewport" | "transition"
  >;

/** Shared scroll/mount reveal animation, replacing the hand-rolled initial/whileInView/transition triplet duplicated across sections. */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.42,
  y = 12,
  x = 0,
  trigger = "view",
  viewportMargin = "-100px",
  ...rest
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Comp = tags[as] as ElementType;

  const hidden = {
    opacity: 0,
    transform: shouldReduceMotion ? "translate(0px, 0px)" : `translate(${x}px, ${y}px)`,
  };
  const visible = { opacity: 1, transform: "translate(0px, 0px)" };
  const transition = {
    duration: shouldReduceMotion ? 0.2 : duration,
    delay: shouldReduceMotion ? 0 : delay,
    ease: EASE,
  };

  const triggerProps =
    trigger === "view"
      ? { whileInView: visible, viewport: { once: true, margin: viewportMargin } }
      : { animate: visible };

  return (
    <Comp initial={hidden} transition={transition} className={className} {...triggerProps} {...rest}>
      {children}
    </Comp>
  );
}
