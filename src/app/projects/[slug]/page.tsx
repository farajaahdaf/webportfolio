import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GridBackground } from "@/components/site/grid-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getProjectBySlug, getPublishedProjects, getSocials } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { isValidUrl } from "@/lib/utils";
import { getLocale } from "@/lib/locale";
import { dictionary, localizeProject, localizeSettings } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

// Always render from Neon at request time so deployed CMS edits are visible immediately.
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [{ url: project.thumbnail }],
    },
  };
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const [project, settings, socials] = await Promise.all([
    getProjectBySlug(slug),
    getSettings(),
    getSocials(),
  ]);
  if (!project || project.status !== "published") notFound();
  const localizedProject = localizeProject(project, locale);
  const localizedSettings = localizeSettings(settings, locale);
  const t = dictionary[locale];

  return (
    <>
      <GridBackground />
      <Navbar settings={localizedSettings} locale={locale} />
      <main className="relative pt-32 md:pt-40">
        <article className="container-prose pb-24">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.projects.back}
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="glass">{localizedProject.category}</Badge>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {localizedProject.status}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {localizedProject.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {localizedProject.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {isValidUrl(localizedProject.liveUrl) && (
                <Button asChild variant="gradient" className="rounded-full">
                  <Link href={localizedProject.liveUrl!} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {t.projects.liveDemo}
                  </Link>
                </Button>
              )}
              {isValidUrl(localizedProject.githubUrl) && (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={localizedProject.githubUrl!} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" />
                    {t.projects.sourceCode}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src={localizedProject.thumbnail}
              alt={localizedProject.title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10" />
          </div>

          {localizedProject.metrics && localizedProject.metrics.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm md:grid-cols-4">
              {localizedProject.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="font-display text-2xl font-semibold text-gradient-static md:text-3xl">
                    {m.value}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="prose mt-12 max-w-3xl prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-code:rounded prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-pre:rounded-xl dark:prose-invert">
            <p className="lead text-lg text-foreground/90">
              {localizedProject.description}
            </p>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {localizedProject.content}
            </ReactMarkdown>
          </div>

          <div className="mt-10 flex flex-wrap gap-1.5">
            {localizedProject.tech.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="rounded-md text-[10px] font-mono uppercase tracking-wider"
              >
                {t}
              </Badge>
            ))}
          </div>
        </article>
      </main>
      <Footer settings={localizedSettings} socials={socials} locale={locale} />
    </>
  );
}
