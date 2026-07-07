"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { isSectionVisible, type SectionKey } from "@/lib/sections";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { dictionary, type Locale } from "@/lib/i18n";

const links: Array<{ href: string; labelKey: keyof typeof dictionary.en.nav; section: SectionKey }> = [
  { href: "/#about", labelKey: "about", section: "about" },
  { href: "/#skills", labelKey: "skills", section: "skills" },
  { href: "/#projects", labelKey: "projects", section: "projects" },
  { href: "/#experience", labelKey: "experience", section: "experience" },
  { href: "/#certificates", labelKey: "certificates", section: "certificates" },
  { href: "/blog", labelKey: "blog", section: "blog" },
];

export function Navbar({
  settings,
  locale = "en",
}: {
  settings?: SiteSettings;
  locale?: Locale;
}) {
  const name = settings?.profile.name || "Faraja Ahdaf";
  const initial = name.charAt(0).toUpperCase();
  const t = dictionary[locale];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const visibleLinks = links.filter((link) => isSectionVisible(settings, link.section));
  const showContact = isSectionVisible(settings, "contact");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-4 z-50 mx-auto flex justify-center px-4 transition-all duration-300",
          scrolled && "top-2"
        )}
      >
        <nav
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-full border border-border bg-card px-4 py-2 shadow-sm transition-all duration-300",
            scrolled && "border-foreground/20 shadow-md"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1 group"
            aria-label={`${name}, Home`}
          >
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground transition-transform group-hover:scale-105">
              <span className="font-display text-sm font-bold text-primary-foreground">
                {initial}
              </span>
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
              {name}
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {t.nav[l.labelKey]}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} label={t.nav.language} compact />
            </div>
            {showContact && (
              <Button
                asChild
                variant="gradient"
                size="sm"
                className="hidden h-9 rounded-full px-4 lg:inline-flex"
              >
                <Link href="/#contact">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t.nav.contact}
                </Link>
              </Button>
            )}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm lg:hidden cursor-pointer"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-border bg-card p-4 shadow-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {visibleLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {t.nav[l.labelKey]}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-3">
                <LanguageSwitcher locale={locale} label={t.nav.language} />
                {showContact && (
                  <Button asChild variant="gradient" size="sm" className="rounded-full">
                    <Link href="/#contact" onClick={() => setOpen(false)}>
                      <Sparkles className="h-3.5 w-3.5" />
                      {t.nav.contact}
                    </Link>
                  </Button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
