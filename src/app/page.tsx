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
import { getLocale } from "@/lib/locale";
import {
  localizeCertificate,
  localizeExperience,
  localizePost,
  localizeProject,
  localizeSettings,
  localizeSkill,
} from "@/lib/i18n";

// Always render from Neon at request time so deployed CMS edits are visible immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
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
  const localizedSettings = localizeSettings(settings, locale);
  const localizedProjects = projects.map((project) => localizeProject(project, locale));
  const localizedPosts = posts.map((post) => localizePost(post, locale));
  const localizedSkills = skills.map((skill) => localizeSkill(skill, locale));
  const localizedExperience = experience.map((item) => localizeExperience(item, locale));
  const localizedCertificates = certificates.map((item) => localizeCertificate(item, locale));

  const completedProjectsCount = localizedProjects.length;
  const technologiesCount = localizedSkills.length;

  return (
    <>
      <GridBackground />
      <Navbar settings={localizedSettings} locale={locale} />
      <main className="relative">
        <Hero settings={localizedSettings} locale={locale} />
        {isSectionVisible(localizedSettings, "about") && (
          <About
            settings={localizedSettings}
            locale={locale}
            completedProjectsCount={completedProjectsCount}
            technologiesCount={technologiesCount}
          />
        )}
        {isSectionVisible(localizedSettings, "skills") && <Skills skills={localizedSkills} locale={locale} />}
        {isSectionVisible(localizedSettings, "projects") && <Projects projects={localizedProjects} locale={locale} />}
        {isSectionVisible(localizedSettings, "experience") && <Experience items={localizedExperience} locale={locale} />}
        {isSectionVisible(localizedSettings, "certificates") && <Certificates items={localizedCertificates} locale={locale} />}
        {isSectionVisible(localizedSettings, "blog") && <BlogPreview posts={localizedPosts} locale={locale} />}
        {isSectionVisible(localizedSettings, "contact") && (
          <Contact settings={localizedSettings} socials={socials} locale={locale} />
        )}
      </main>
      <Footer settings={localizedSettings} socials={socials} locale={locale} />
    </>
  );
}
