import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GridBackground } from "@/components/site/grid-background";
import { SectionHeader } from "@/components/site/section-header";
import { BlogSearch } from "./blog-search";
import { getPublishedPosts, getSocials } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionVisible } from "@/lib/sections";

// ISR: refresh from Neon at most once per minute (CMS edits without redeploy).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on engineering, AI research, and craft.",
};

export default async function BlogIndex() {
  const [posts, settings, socials] = await Promise.all([
    getPublishedPosts(),
    getSettings(),
    getSocials(),
  ]);
  if (!isSectionVisible(settings, "blog")) notFound();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <GridBackground />
      <Navbar settings={settings} />
      <main className="relative pt-32 md:pt-40">
        <div className="container-prose pb-24">
          <SectionHeader
            eyebrow="Writing"
            title="Field notes."
            description="Essays and short notes on engineering, AI research, and craft."
          />

          <BlogSearch posts={posts} categories={categories} />
        </div>
      </main>
      <Footer settings={settings} socials={socials} />
    </>
  );
}
