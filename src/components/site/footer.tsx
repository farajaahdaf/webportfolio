import Link from "next/link";
import { Github, Linkedin, Mail, Instagram, Twitter, Youtube, Globe, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { SiteSettings, Social } from "@/lib/types";
import { isValidUrl } from "@/lib/utils";
import { isSectionVisible, type SectionKey } from "@/lib/sections";
import { dictionary, type Locale } from "@/lib/i18n";

const socialIconMap: Record<string, LucideIcon> = {
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
  return socialIconMap[platform.toLowerCase()] || Globe;
}

export function Footer({
  settings,
  socials,
  locale = "en",
}: {
  settings?: SiteSettings;
  socials?: Social[];
  locale?: Locale;
}) {
  const t = dictionary[locale];
  const year = new Date().getFullYear();
  const name = settings?.profile.name || "Faraja Ahdaf";
  const initial = name.charAt(0).toUpperCase();
  const tagline = settings?.footer.tagline || "";
  const resume = settings?.profile.resumeUrl;
  const visibleSocials = (socials || []).filter((s) => s.visible);

  const navItems: Array<{ label: string; href: string; section: SectionKey }> = [
    { label: t.nav.about, href: "/#about", section: "about" },
    { label: t.nav.projects, href: "/#projects", section: "projects" },
    { label: t.nav.experience, href: "/#experience", section: "experience" },
    { label: t.nav.certificates, href: "/#certificates", section: "certificates" },
    { label: t.nav.blog, href: "/blog", section: "blog" },
  ];

  const navGroups = [
    {
      title: t.footer.navigate,
      items: navItems.filter((item) => isSectionVisible(settings, item.section)),
    },
    {
      title: t.footer.connect,
      items: visibleSocials.map((s) => ({
        label: s.platform,
        href: s.url,
        external: !s.url.startsWith("/"),
      })),
    },
    {
      title: t.footer.resources,
      items: [
        ...(isValidUrl(resume)
          ? [{ label: t.footer.resume, href: resume!, external: true }]
          : []),
        { label: t.footer.admin, href: "/admin" },
      ],
    },
  ];

  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container-prose py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
                <span className="font-display text-sm font-bold text-primary-foreground">
                  {initial}
                </span>
              </span>
              <span className="font-display text-lg font-semibold">{name}</span>
            </Link>
            {tagline && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {tagline}
              </p>
            )}
            {visibleSocials.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {visibleSocials.map((s) => {
                  const Icon = iconFor(s.platform);
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target={s.url.startsWith("/") ? undefined : "_blank"}
                      rel={s.url.startsWith("/") ? undefined : "noreferrer"}
                      aria-label={s.platform}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-[color,background-color,border-color] duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/30 hover:bg-secondary hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
            {navGroups.map((g) => (
              <div key={g.title}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {g.title}
                </h4>
                <ul className="space-y-2">
                  {g.items.map((it) => (
                    <li key={`${g.title}-${it.label}`}>
                      <Link
                        href={it.href}
                        target={"external" in it && it.external ? "_blank" : undefined}
                        rel={"external" in it && it.external ? "noreferrer" : undefined}
                        className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-primary"
                      >
                        {it.label}
                        {"external" in it && it.external && (
                          <ArrowUpRight className="motion-hover-arrow-reveal h-3 w-3" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {year} {name}. {t.footer.rights}
          </p>
          <p className="font-mono">
            {t.footer.builtWith} <span className="text-foreground">Next.js</span> &amp;{" "}
            <span className="text-foreground">Tailwind CSS</span>
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
      >
        <span className="select-none bg-gradient-to-b from-foreground/[0.04] to-transparent bg-clip-text font-display text-[18vw] font-black leading-none tracking-tighter text-transparent">
          {name.split(" ")[0].toUpperCase()}
        </span>
      </div>
    </footer>
  );
}
