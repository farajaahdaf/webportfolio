import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GridBackground } from "@/components/site/grid-background";
import { SectionHeader } from "@/components/site/section-header";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects, getSocials } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { getLocale } from "@/lib/locale";
import { dictionary, localizeProject, localizeSettings } from "@/lib/i18n";
import type { Metadata } from "next";

// Always render from the database so deployed CMS edits are visible immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "A complete catalog of selected work, web, AI, and research.",
};

export default async function ProjectsIndex() {
  const locale = await getLocale();
  const [projects, settings, socials] = await Promise.all([
    getPublishedProjects(),
    getSettings(),
    getSocials(),
  ]);
  const t = dictionary[locale];
  const localizedSettings = localizeSettings(settings, locale);
  const localizedProjects = projects.map((project) => localizeProject(project, locale));

  return (
    <>
      <GridBackground />
      <Navbar settings={localizedSettings} locale={locale} />
      <main className="relative pt-32 md:pt-40">
        <div className="container-prose pb-24">
          <SectionHeader
            eyebrow={t.projects.allEyebrow}
            title={t.projects.allTitle}
            description={t.projects.allDescription}
          />

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localizedProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-foreground/25 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.thumbnail}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                  <Badge variant="glass" className="absolute left-4 top-4">
                    {p.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="rounded-md text-[10px] font-mono uppercase tracking-wider"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={localizedSettings} socials={socials} locale={locale} />
    </>
  );
}
