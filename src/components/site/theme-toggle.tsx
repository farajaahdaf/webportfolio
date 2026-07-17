"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme : "light") === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] hover:border-primary/40 hover:bg-secondary cursor-pointer dark:bg-background/40",
        className
      )}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-[transform,opacity] [transition-duration:180ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]",
          isDark ? "scale-[0.92] rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-[transform,opacity] [transition-duration:180ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-[0.92] -rotate-90 opacity-0"
        )}
      />
    </button>
  );
}
