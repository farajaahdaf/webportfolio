"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const SIMPLE_ICONS_BASE = "https://cdn.simpleicons.org";

/**
 * Tech logo via Simple Icons CDN.
 * Falls back to a monogram tile if the slug is missing or fails to load.
 */
export function TechIcon({
  slug,
  color,
  name,
  className,
  size = 24,
}: {
  slug?: string;
  color?: string;
  name: string;
  className?: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const showFallback = !slug || errored;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-border bg-background/50 font-mono text-xs font-semibold text-primary",
          className
        )}
        style={{ width: size + 16, height: size + 16 }}
        aria-hidden
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  const url = color
    ? `${SIMPLE_ICONS_BASE}/${slug}/${color.replace("#", "")}`
    : `${SIMPLE_ICONS_BASE}/${slug}`;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-border bg-background/50 p-2",
        className
      )}
      style={{ width: size + 16, height: size + 16 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
