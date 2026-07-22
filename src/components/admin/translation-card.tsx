"use client";

export function TranslationCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
      <div className="mb-4">
        <h3 className="font-display text-sm font-semibold tracking-tight">
          Indonesian translation
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Optional. Used when visitors choose Bahasa Indonesia. Empty fields fall back to the default content.
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
