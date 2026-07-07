import "server-only";
import { readKV, writeKV } from "./db";
import type { SiteSettings } from "./types";
import { DEFAULT_SECTIONS } from "./sections";

const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS: SiteSettings = {
  profile: {
    name: "Faraja Ahdaf",
    title: "AI & Machine Learning · Data Analysis · Applied AI",
    tagline:
      "Exploring applied AI, machine learning, and data analysis through practical experiments and research-minded builds.",
    description:
      "I focus on understanding data, evaluating models, and turning machine learning ideas into small, useful systems. Web development is a supporting skill I use when a project needs an interface.",
    avatar: "",
    resumeUrl: "/resume.pdf",
    location: "Indonesia",
    availability: "Available for select engagements",
  },
  hero: {
    badge: "",
    primaryCta: { label: "View Projects", href: "/#projects" },
    secondaryCta: { label: "Download Resume", href: "/resume.pdf" },
    tertiaryCta: { label: "Contact Me", href: "/#contact" },
    techRibbon: [
      "Python",
      "Machine Learning",
      "Data Analysis",
      "Transformers",
      "PostgreSQL",
      "Pandas",
      "Scikit-learn",
      "NLP",
      "Visualization",
    ],
  },
  about: {
    eyebrow: "About",
    title: "Learning by measuring models and data.",
    description:
      "My strongest interest is AI, machine learning, and data analysis. I use web development as a side skill to present experiments, build small tools, and make results easier to understand.",
    expertise: [
      { icon: "Brain", title: "Artificial Intelligence", blurb: "Applied AI experiments focused on useful outcomes, not hype." },
      { icon: "Cpu", title: "Machine Learning", blurb: "Training, evaluating, and comparing models with clear metrics." },
      { icon: "Database", title: "Data Analysis", blurb: "Cleaning, exploring, and visualizing data to find patterns." },
      { icon: "Microscope", title: "Model Evaluation", blurb: "Looking beyond accuracy: F1, latency, errors, and tradeoffs." },
      { icon: "Sparkles", title: "NLP & Transformers", blurb: "Working with text classification, embeddings, and transformer models." },
      { icon: "Code2", title: "Web as a Side Skill", blurb: "Building simple interfaces when AI and data projects need presentation." },
    ],
    stats: {
      yearsExperience: 0,
      researchCount: 0,
    },
  },
  contact: {
    email: "faraja@example.com",
    blurb:
      "Have a project in mind, an idea worth exploring, or just want to say hi? My inbox is open.",
  },
  footer: {
    tagline:
      "Focused on AI, machine learning, and data analysis, with web development as a practical supporting skill.",
  },
  sections: DEFAULT_SECTIONS,
};

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (typeof base !== "object" || base === null) return (override as T) ?? base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(override as Record<string, unknown>)) {
    const ov = (override as Record<string, unknown>)[k];
    const bv = (base as Record<string, unknown>)[k];
    if (
      ov &&
      typeof ov === "object" &&
      !Array.isArray(ov) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[k] = deepMerge(bv, ov as Record<string, unknown>);
    } else if (ov !== undefined) {
      out[k] = ov;
    }
  }
  return out as T;
}

export async function getSettings(): Promise<SiteSettings> {
  const stored = await readKV<Partial<SiteSettings> | null>(SETTINGS_KEY, null);
  if (!stored) return DEFAULT_SETTINGS;
  return deepMerge(DEFAULT_SETTINGS, stored);
}

export async function writeSettings(next: SiteSettings): Promise<void> {
  await writeKV(SETTINGS_KEY, next);
}
