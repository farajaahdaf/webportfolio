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
import { getLocale } from "@/lib/locale";
import { dictionary, localizePost, localizeSettings } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

// Always render from the database so deployed CMS edits are visible immediately.
export const dynamic = "force-dynamic";

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
  const locale = await getLocale();
  const [post, settings, socials] = await Promise.all([
    getPostBySlug(slug),
    getSettings(),
    getSocials(),
  ]);
  const localizedSettings = localizeSettings(settings, locale);
  const t = dictionary[locale];
  if (!isSectionVisible(localizedSettings, "blog")) notFound();
  if (!post || post.status !== "published") notFound();
  const localizedPost = localizePost(post, locale);

  return (
    <>
      <GridBackground />
      <Navbar settings={localizedSettings} locale={locale} />
      <main className="relative pt-32 md:pt-40">
        <article className="container-prose pb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.blog.back}
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="glass">{localizedPost.category}</Badge>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(localizedPost.publishedAt || localizedPost.createdAt, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" />
                {readingTime(localizedPost.content)} {t.blog.min}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {localizedPost.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {localizedPost.excerpt}
            </p>
          </div>

          {localizedPost.cover && (
            <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src={localizedPost.cover}
                alt={localizedPost.title}
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
              {localizedPost.content}
            </ReactMarkdown>
          </div>

          {localizedPost.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-1.5">
              {localizedPost.tags.map((t) => (
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
      <Footer settings={localizedSettings} socials={socials} locale={locale} />
    </>
  );
}
