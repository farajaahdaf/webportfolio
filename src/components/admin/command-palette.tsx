"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Loader2,
  FolderKanban,
  FileText,
  Sparkles,
  Briefcase,
  Award,
  Share2,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";

type Hit = {
  collection:
    | "projects"
    | "posts"
    | "skills"
    | "experience"
    | "certificates"
    | "socials";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  snippet?: string;
};

const iconMap: Record<Hit["collection"], LucideIcon> = {
  projects: FolderKanban,
  posts: FileText,
  skills: Sparkles,
  experience: Briefcase,
  certificates: Award,
  socials: Share2,
};

const labelMap: Record<Hit["collection"], string> = {
  projects: "Project",
  posts: "Post",
  skills: "Skill",
  experience: "Experience",
  certificates: "Certificate",
  socials: "Social",
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K to open, Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, Math.max(0, hits.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === "Enter") {
        const h = hits[active];
        if (h) {
          onOpenChange(false);
          router.push(`${h.href}?focus=${h.id}`);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hits, active, onOpenChange, router]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setHits([]);
      setActive(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    const needle = q.trim();
    if (!needle) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(needle)}`);
        const data = await res.json();
        setHits(data.hits || []);
        setActive(0);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [q]);

  // Group hits by collection
  const grouped = hits.reduce<Record<string, Hit[]>>((acc, h) => {
    (acc[h.collection] = acc[h.collection] || []).push(h);
    return acc;
  }, {});
  const order: Hit["collection"][] = [
    "projects",
    "posts",
    "skills",
    "experience",
    "certificates",
    "socials",
  ];

  let runningIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-foreground/20 backdrop-blur-md p-4 pt-[12vh]"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects, posts, skills, experience, certificates, socials…"
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                Esc
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!q.trim() ? (
                <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                  Start typing to search across all content. Use ↑↓ to navigate, Enter to open.
                </p>
              ) : hits.length === 0 && !loading ? (
                <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                  No matches for &quot;{q}&quot;.
                </p>
              ) : (
                order
                  .filter((c) => grouped[c]?.length)
                  .map((c) => {
                    const Icon = iconMap[c];
                    return (
                      <div key={c} className="mb-2">
                        <p className="px-3 pb-1 pt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                          {labelMap[c]}s
                        </p>
                        <ul>
                          {grouped[c].map((h) => {
                            runningIdx += 1;
                            const isActive = runningIdx === active;
                            const myIdx = runningIdx;
                            return (
                              <li key={h.id}>
                                <button
                                  type="button"
                                  onMouseEnter={() => setActive(myIdx)}
                                  onClick={() => {
                                    onOpenChange(false);
                                    router.push(`${h.href}?focus=${h.id}`);
                                  }}
                                  className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer ${
                                    isActive ? "bg-primary/10" : "hover:bg-secondary"
                                  }`}
                                >
                                  <div
                                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                                      isActive
                                        ? "border-primary/30 text-primary"
                                        : "border-border text-muted-foreground"
                                    }`}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={`truncate text-sm font-medium ${
                                        isActive ? "text-primary" : ""
                                      }`}
                                    >
                                      {h.title}
                                    </p>
                                    {h.subtitle && (
                                      <p className="truncate text-xs text-muted-foreground">
                                        {h.subtitle}
                                      </p>
                                    )}
                                    {h.snippet && (
                                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/80">
                                        {h.snippet}
                                      </p>
                                    )}
                                  </div>
                                  {isActive && (
                                    <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border bg-secondary px-4 py-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-mono">
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-mono">
                    ⏎
                  </kbd>
                  Open
                </span>
              </div>
              <span>{hits.length} result{hits.length === 1 ? "" : "s"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
