import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Certificates } from "@/components/sections/certificates";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Contact } from "@/components/sections/contact";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GridBackground } from "@/components/site/grid-background";
import {
  getPublishedProjects,
  getPublishedPosts,
  getSkills,
  getExperience,
  getCertificates,
  getSocials,
} from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { isSectionVisible } from "@/lib/sections";

// ISR: regenerate from Neon at most once per minute so CMS edits appear
// without a redeploy. New slugs render on-demand (dynamicParams default).
export const revalidate = 60;

export default async function HomePage() {
  const [projects, posts, skills, experience, certificates, socials, settings] =
    await Promise.all([
      getPublishedProjects(),
      getPublishedPosts(),
      getSkills(),
      getExperience(),
      getCertificates(),
      getSocials(),
      getSettings(),
    ]);

  const completedProjectsCount = projects.length;
  const technologiesCount = skills.length;

  return (
    <>
      <GridBackground />
      <Navbar settings={settings} />
      <main className="relative">
        <Hero settings={settings} />
        {isSectionVisible(settings, "about") && (
          <About
            settings={settings}
            completedProjectsCount={completedProjectsCount}
            technologiesCount={technologiesCount}
          />
        )}
        {isSectionVisible(settings, "skills") && <Skills skills={skills} />}
        {isSectionVisible(settings, "projects") && <Projects projects={projects} />}
        {isSectionVisible(settings, "experience") && <Experience items={experience} />}
        {isSectionVisible(settings, "certificates") && <Certificates items={certificates} />}
        {isSectionVisible(settings, "blog") && <BlogPreview posts={posts} />}
        {isSectionVisible(settings, "contact") && (
          <Contact settings={settings} socials={socials} />
        )}
      </main>
      <Footer settings={settings} socials={socials} />
    </>
  );
}
