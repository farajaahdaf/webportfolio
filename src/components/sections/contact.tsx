"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/site/section-header";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Send,
  ArrowUpRight,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import type { SiteSettings, Social } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

const iconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  mail: Mail,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
};

function iconFor(platform: string): LucideIcon {
  return iconMap[platform.toLowerCase()] || Globe;
}

export function Contact({
  settings,
  socials,
  locale = "en",
}: {
  settings?: SiteSettings;
  socials?: Social[];
  locale?: Locale;
}) {
  const [busy, setBusy] = useState(false);
  const t = dictionary[locale];

  const blurb =
    settings?.contact.blurb ||
    t.contact.fallbackBlurb;

  const channels = (socials || []).filter((s) => s.visible);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(t.contact.success);
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error(t.contact.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" className="relative py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          description={blurb}
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, transform: "translateX(-12px)" }}
            whileInView={{ opacity: 1, transform: "translateX(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-2"
          >
            <div className="space-y-3">
              {channels.map((c) => {
                const Icon = iconFor(c.platform);
                const isHttp = c.url.startsWith("http");
                return (
                  <a
                    key={c.id}
                    href={c.url}
                    target={isHttp ? "_blank" : undefined}
                    rel={isHttp ? "noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/25 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors group-hover:border-foreground/30">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {c.platform}
                      </p>
                      <p className="truncate text-sm font-medium">{c.handle || c.url}</p>
                    </div>
                    <ArrowUpRight className="motion-hover-diagonal-arrow h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                );
              })}
            </div>

            {settings?.profile.availability && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <p className="text-sm font-medium">{settings.profile.availability}</p>
                </div>
                {settings.profile.location && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t.contact.basedIn} {settings.profile.location}, {t.contact.workingGlobally}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, transform: "translateX(12px)" }}
            whileInView={{ opacity: 1, transform: "translateX(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8 lg:col-span-3"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t.contact.name}</Label>
                <Input id="name" name="name" placeholder={t.contact.namePlaceholder} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t.contact.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="subject">{t.contact.subject}</Label>
              <Input
                id="subject"
                name="subject"
                placeholder={t.contact.subjectPlaceholder}
                required
              />
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="message">{t.contact.message}</Label>
              <Textarea
                id="message"
                name="message"
                placeholder={t.contact.messagePlaceholder}
                rows={6}
                required
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {t.contact.reply}
              </p>
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={busy}
                className="rounded-full"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.contact.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.contact.send}
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
