"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { localeNames, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  label,
  compact = false,
}: {
  locale: Locale;
  label: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loadingLocale, setLoadingLocale] = useState<Locale | null>(null);
  const isLoading = pending || loadingLocale !== null;

  useEffect(() => {
    if (!pending) setLoadingLocale(null);
  }, [pending, locale]);

  function setLocale(next: Locale) {
    if (next === locale || isLoading) return;
    setLoadingLocale(next);
    startTransition(async () => {
      const res = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setLoadingLocale(null);
      }
    });
  }

  return (
    <>
      <div
        className={cn(
          "inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm transition-opacity",
          compact ? "gap-0.5" : "gap-1",
          isLoading && "opacity-80"
        )}
        aria-label={label}
        role="group"
      >
        {(["en", "id"] as const).map((option) => {
          const active = option === locale;
          const optionLoading = loadingLocale === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setLocale(option)}
              disabled={isLoading}
              aria-pressed={active}
              aria-busy={optionLoading}
              aria-label={`${label}: ${localeNames[option]}`}
              className={cn(
                "relative rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors disabled:cursor-wait",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                optionLoading && "bg-foreground text-background"
              )}
            >
              <span className={cn(optionLoading && "opacity-0")}>{option}</span>
              {optionLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-3 w-3 animate-spin rounded-full border border-background/35 border-t-background" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="pointer-events-none fixed inset-0 z-[100] flex items-start justify-center bg-background/12 backdrop-blur-[2px]">
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-secondary">
            <div className="h-full w-1/2 animate-[language-progress_1s_ease-in-out_infinite] bg-primary" />
          </div>
          <div
            role="status"
            aria-live="polite"
            className="mt-24 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-lg"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            Switching to {loadingLocale ? localeNames[loadingLocale] : localeNames[locale]}...
          </div>
        </div>
      )}
    </>
  );
}
