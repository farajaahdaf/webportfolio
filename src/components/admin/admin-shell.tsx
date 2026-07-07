"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  Briefcase,
  Award,
  Share2,
  LogOut,
  Settings,
  Menu,
  X,
  Search,
  ExternalLink,
} from "lucide-react";
import { CommandPalette } from "@/components/admin/command-palette";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  user: { name: string; email: string };
  children: React.ReactNode;
};

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/socials", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminShell({ user, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card shadow-sm transition-transform lg:relative lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="font-display text-sm font-bold text-primary-foreground">
                F.
              </span>
            </span>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              <p className="-mt-0.5 font-display text-sm font-semibold">
                Console
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Account
          </div>
          <ul className="mt-2 space-y-1 px-0">
            <li>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                Open site
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              {user.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Topbar + content */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-5 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground cursor-pointer"
              aria-label="Open search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search everything</span>
              <span className="hidden sm:inline rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </span>
            </button>
            <p className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground lg:block">
              Faraja CMS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/" target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
                View site
              </Link>
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
