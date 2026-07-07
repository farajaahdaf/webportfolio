import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GridBackground } from "@/components/site/grid-background";
import { SectionHeader } from "@/components/site/section-header";
import { BlogSearch } from "./blog-search";
import { getPublishedPosts, getSocials } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { getLocale } from "@/lib/locale";
import { dictionary, localizePost, localizeSettings } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionVisible } from "@/lib/sections";

// Always render from Neon at request time so deployed CMS edits are visible immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on engineering, AI research, and craft.",
};

export default async function BlogIndex() {
  const locale = await getLocale();
  const [posts, settings, socials] = await Promise.all([
    getPublishedPosts(),
    getSettings(),
    getSocials(),
  ]);
  const localizedSettings = localizeSettings(settings, locale);
  const localizedPosts = posts.map((post) => localizePost(post, locale));
  const t = dictionary[locale];
  if (!isSectionVisible(localizedSettings, "blog")) notFound();
  const categories = Array.from(new Set(localizedPosts.map((p) => p.category)));

  return (
    <>
      <GridBackground />
      <Navbar settings={localizedSettings} locale={locale} />
      <main className="relative pt-32 md:pt-40">
        <div className="container-prose pb-24">
          <SectionHeader
            eyebrow={t.blog.eyebrow}
            title={t.blog.indexTitle}
            description={t.blog.description}
          />

          <BlogSearch posts={localizedPosts} categories={categories} locale={locale} />
        </div>
      </main>
      <Footer settings={localizedSettings} socials={socials} locale={locale} />
    </>
  );
}
