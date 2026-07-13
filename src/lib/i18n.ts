import type {
  Certificate,
  Experience,
  Post,
  Project,
  SiteSettings,
  Skill,
} from "./types";

export const LOCALES = ["en", "id"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "portfolio_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "id";
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Indonesia",
};

export const dictionary = {
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      certificates: "Certificates",
      experience: "Experience",
      blog: "Blog",
      contact: "Contact",
      language: "Language",
    },
    hero: {
      workingWith: "Working with",
      scroll: "Scroll",
    },
    about: {
      yearsExperience: "Years experience",
      projectsCompleted: "Projects completed",
      technologiesMastered: "Technologies mastered",
      researchExperiments: "Research & experiments",
    },
    skills: {
      eyebrow: "Skills",
      title: "A toolkit, not a stack.",
      description:
        "Curated technologies I reach for, chosen for clarity, reliability, and a tight feedback loop.",
      all: "All",
      empty: "No skills in this category yet.",
    },
    projects: {
      eyebrow: "Featured Projects",
      title: "Selected work that ships.",
      description:
        "A snapshot of recent builds, from AI research to production systems and admin platforms.",
      viewAll: "View all projects",
      allEyebrow: "All projects",
      allTitle: "A complete index.",
      allDescription:
        "Every published build, sorted by recency. Hover for highlights, click for the case study.",
      featured: "Featured",
      liveDemo: "Live demo",
      sourceCode: "Source code",
      readCaseStudy: "Read case study",
      back: "All projects",
    },
    experience: {
      eyebrow: "Experience",
      title: "A path of practical work.",
      description: "Where I've built, taught, researched, and shipped.",
      present: "Present",
    },
    certificates: {
      eyebrow: "Certificates",
      title: "Verified credentials.",
      description: "Issued certificates and credentials, with downloadable PDFs.",
      viewPdf: "View PDF",
      verify: "Verify",
      noPublicLink: "No public link",
    },
    blog: {
      eyebrow: "Writing",
      title: "Notes from the field.",
      description: "Field notes on engineering, AI research, and craft.",
      indexTitle: "Field notes.",
      allPosts: "All posts",
      searchPlaceholder: "Search posts, tags, ideas...",
      empty: "No posts match that search.",
      minRead: "min read",
      min: "min",
      back: "All posts",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something.",
      fallbackBlurb:
        "Have a project in mind, an idea worth exploring, or just want to say hi? My inbox is open.",
      basedIn: "Based in",
      workingGlobally: "working globally.",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      subject: "Subject",
      subjectPlaceholder: "What's this about?",
      message: "Message",
      messagePlaceholder: "Tell me a bit about your project, timeline, and goals.",
      reply: "I'll reply within 24 hours.",
      sending: "Sending",
      send: "Send message",
      success: "Message received, I'll reply within 24 hours.",
      error: "Couldn't send right now, try email instead.",
    },
    footer: {
      navigate: "Navigate",
      connect: "Connect",
      resources: "Resources",
      resume: "Resume",
      admin: "Admin",
      rights: "All rights reserved.",
      builtWith: "Built with",
    },
  },
  id: {
    nav: {
      about: "Tentang",
      skills: "Keahlian",
      projects: "Proyek",
      certificates: "Sertifikat",
      experience: "Pengalaman",
      blog: "Blog",
      contact: "Kontak",
      language: "Bahasa",
    },
    hero: {
      workingWith: "Terbiasa dengan",
      scroll: "Gulir",
    },
    about: {
      yearsExperience: "Tahun pengalaman",
      projectsCompleted: "Proyek diselesaikan",
      technologiesMastered: "Teknologi dikuasai",
      researchExperiments: "Riset & eksperimen",
    },
    skills: {
      eyebrow: "Keahlian",
      title: "Perkakas yang terkurasi, bukan sekadar tumpukan.",
      description:
        "Teknologi yang saya pilih berdasarkan kejelasan, keandalan, dan siklus umpan balik yang cepat.",
      all: "Semua",
      empty: "Belum ada keahlian di kategori ini.",
    },
    projects: {
      eyebrow: "Proyek Pilihan",
      title: "Karya yang tayang dan berfungsi.",
      description:
        "Cuplikan proyek terbaru—dari riset AI, sistem produksi, hingga platform admin.",
      viewAll: "Lihat semua proyek",
      allEyebrow: "Semua proyek",
      allTitle: "Indeks lengkap.",
      allDescription:
        "Seluruh proyek yang sudah dipublikasikan, diurutkan dari yang terbaru. Arahkan kursor untuk sorotan, klik untuk studi kasus.",
      featured: "Pilihan",
      liveDemo: "Demo langsung",
      sourceCode: "Kode sumber",
      readCaseStudy: "Baca studi kasus",
      back: "Semua proyek",
    },
    experience: {
      eyebrow: "Pengalaman",
      title: "Lintasan kerja yang terukur.",
      description: "Tempat saya membangun, mengajar, meneliti, dan menghasilkan.",
      present: "Sekarang",
    },
    certificates: {
      eyebrow: "Sertifikat",
      title: "Kredensial yang terverifikasi.",
      description: "Sertifikat dan kredensial resmi, lengkap dengan PDF yang dapat diunduh.",
      viewPdf: "Lihat PDF",
      verify: "Verifikasi",
      noPublicLink: "Tidak ada tautan publik",
    },
    blog: {
      eyebrow: "Tulisan",
      title: "Catatan dari lapangan.",
      description: "Catatan seputar rekayasa perangkat lunak, riset AI, dan keahlian teknis.",
      indexTitle: "Catatan lapangan.",
      allPosts: "Semua tulisan",
      searchPlaceholder: "Cari tulisan, tag, atau ide...",
      empty: "Tidak ada tulisan yang cocok dengan pencarian tersebut.",
      minRead: "menit baca",
      min: "menit",
      back: "Semua tulisan",
    },
    contact: {
      eyebrow: "Kontak",
      title: "Mari berbincang.",
      fallbackBlurb:
        "Punya proyek, ide yang ingin dieksplorasi, atau sekadar ingin menyapa? Kotak masuk saya selalu terbuka.",
      basedIn: "Berbasis di",
      workingGlobally: "bekerja secara global.",
      name: "Nama",
      namePlaceholder: "Nama Anda",
      email: "Email",
      subject: "Subjek",
      subjectPlaceholder: "Apa yang ingin Anda bicarakan?",
      message: "Pesan",
      messagePlaceholder: "Ceritakan proyek, linimasa, dan tujuan Anda secara singkat.",
      reply: "Saya akan membalas dalam 24 jam.",
      sending: "Mengirim",
      send: "Kirim pesan",
      success: "Pesan diterima. Saya akan membalas dalam 24 jam.",
      error: "Gagal mengirim saat ini. Silakan coba lewat email.",
    },
    footer: {
      navigate: "Navigasi",
      connect: "Terhubung",
      resources: "Sumber daya",
      resume: "Resume",
      admin: "Admin",
      rights: "Seluruh hak cipta dilindungi.",
      builtWith: "Dibangun dengan",
    },
  },
} as const;

export type Dictionary = (typeof dictionary)[Locale];

type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

type WithTranslations<T> = T & {
  translations?: Partial<Record<Locale, DeepPartial<Omit<T, "translations">>>>;
};

function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (!override) return base;
  if (typeof base !== "object" || base === null) return (override as T) ?? base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const next = (override as Record<string, unknown>)[key];
    const current = (base as Record<string, unknown>)[key];
    if (
      next &&
      current &&
      typeof next === "object" &&
      typeof current === "object" &&
      !Array.isArray(next) &&
      !Array.isArray(current)
    ) {
      out[key] = deepMerge(current, next as Record<string, unknown>);
    } else if (next !== undefined) {
      out[key] = next;
    }
  }
  return out as T;
}

export function localizeRecord<T>(item: WithTranslations<T>, locale: Locale): T {
  return deepMerge<T>(item as T, item.translations?.[locale] as DeepPartial<T> | undefined);
}

export function localizeSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  return localizeRecord(settings, locale);
}

export function localizeProject(project: Project, locale: Locale): Project {
  return localizeRecord(project, locale);
}

export function localizePost(post: Post, locale: Locale): Post {
  return localizeRecord(post, locale);
}

export function localizeSkill(skill: Skill, locale: Locale): Skill {
  return localizeRecord(skill, locale);
}

export function localizeExperience(item: Experience, locale: Locale): Experience {
  return localizeRecord(item, locale);
}

export function localizeCertificate(item: Certificate, locale: Locale): Certificate {
  return localizeRecord(item, locale);
}
