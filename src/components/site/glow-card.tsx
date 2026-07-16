"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function GlowCard({
  children,
  className,
  glowColor = "hsl(var(--primary) / 0.13)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 100, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 100, damping: 20 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${springX}px ${springY}px, ${glowColor}, transparent 50%)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") {
          if (active) setActive(false);
          return;
        }
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        pointerX.set(e.clientX - r.left);
        pointerY.set(e.clientY - r.top);
      }}
      onPointerEnter={(e) => setActive(e.pointerType === "mouse")}
      onPointerLeave={() => setActive(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/25 hover:shadow-md dark:bg-card dark:shadow-sm",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px transition-opacity duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          opacity: active ? 1 : 0,
          background,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
