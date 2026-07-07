"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  onAction,
  actionLabel = "New",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action ??
        (onAction && (
          <Button onClick={onAction} variant="gradient" className="rounded-full">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        ))}
    </header>
  );
}
