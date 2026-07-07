import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GridBackground } from "@/components/site/grid-background";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getPostBySlug, getPublishedPosts, getSocials } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { formatDate, readingTime } from "@/lib/utils";
import { isSectionVisible } from "@/lib/sections";

type Props = { params: Promise<{ slug: string }> };

// ISR: refresh from Neon at most once per minute (CMS edits without redeploy).
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function PostDetail({ params }: Props) {
  const { slug } = await params;
  const [post, settings, socials] = await Promise.all([
    getPostBySlug(slug),
    getSettings(),
    getSocials(),
  ]);
  if (!isSectionVisible(settings, "blog")) notFound();
  if (!post || post.status !== "published") notFound();

  return (
    <>
      <GridBackground />
      <Navbar settings={settings} />
      <main className="relative pt-32 md:pt-40">
        <article className="container-prose pb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="glass">{post.category}</Badge>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" />
                {readingTime(post.content)} min
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </div>

          {post.cover && (
            <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10" />
            </div>
          )}

          <div className="prose mt-12 max-w-3xl prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-code:rounded prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-pre:rounded-xl prose-pre:border prose-pre:border-border dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="rounded-md text-[10px] font-mono uppercase tracking-wider"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer settings={settings} socials={socials} />
    </>
  );
}
