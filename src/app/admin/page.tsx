import { redirect } from "next/navigation";
import {
  FolderKanban,
  FileText,
  Sparkles,
  Briefcase,
  Award,
  Share2,
  Eye,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  getProjects,
  getPosts,
  getSkills,
  getExperience,
  getCertificates,
} from "@/lib/data";
import { readCollection } from "@/lib/db";
import { DashboardChart } from "@/components/admin/dashboard-chart";
import { Badge } from "@/components/ui/badge";

export default async function AdminHome() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [projects, posts, skills, experience, certificates, socials] =
    await Promise.all([
      getProjects(),
      getPosts(),
      getSkills(),
      getExperience(),
      getCertificates(),
      readCollection("socials"),
    ]);

  const publishedProjects = projects.filter((p) => p.status === "published");
  const publishedPosts = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft").length +
    projects.filter((p) => p.status === "draft").length;

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      sub: `${publishedProjects.length} published`,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Blog posts",
      value: posts.length,
      sub: `${publishedPosts.length} published`,
      href: "/admin/posts",
      icon: FileText,
    },
    {
      label: "Skills",
      value: skills.length,
      sub: "Curated stack",
      href: "/admin/skills",
      icon: Sparkles,
    },
    {
      label: "Experience",
      value: experience.length,
      sub: "Timeline entries",
      href: "/admin/experience",
      icon: Briefcase,
    },
    {
      label: "Certificates",
      value: certificates.length,
      sub: "Issued credentials",
      href: "/admin/certificates",
      icon: Award,
    },
    {
      label: "Social links",
      value: socials.length,
      sub: "Networks",
      href: "/admin/socials",
      icon: Share2,
    },
  ];

  const recent = [...posts, ...projects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  return (
    <div>
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Hi, {session.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s a quick look at your portfolio&apos;s content health.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" className="gap-1">
            <Activity className="h-3 w-3" />
            All systems normal
          </Badge>
          {drafts > 0 && (
            <Badge variant="warning">{drafts} drafts pending</Badge>
          )}
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-foreground/25 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <s.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{s.sub}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">
              Content activity
            </h2>
            <Badge variant="glass">Last 6 months</Badge>
          </div>
          <div className="mt-4 h-64">
            <DashboardChart projects={projects} posts={posts} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">
              Recent edits
            </h2>
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <ul className="mt-4 space-y-3">
            {recent.map((r) => {
              const isPost = "excerpt" in r;
              const href = isPost
                ? `/admin/posts?edit=${r.id}`
                : `/admin/projects?edit=${r.id}`;
              return (
                <li key={r.id}>
                  <Link
                    href={href}
                    className="group flex items-start justify-between gap-2 rounded-lg p-2 transition-colors hover:bg-secondary"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {isPost ? (
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <FolderKanban className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                          {r.title}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {new Date(r.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={r.status === "published" ? "success" : "warning"}
                      className="shrink-0 text-[10px]"
                    >
                      {r.status}
                    </Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
