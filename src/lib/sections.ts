import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SECTIONS = {
  about: true,
  skills: true,
  projects: true,
  experience: true,
  certificates: true,
  blog: true,
  contact: true,
} as const;

export type SectionKey = keyof typeof DEFAULT_SECTIONS;

export function isSectionVisible(
  settings: Pick<SiteSettings, "sections"> | undefined,
  section: SectionKey
): boolean {
  return settings?.sections?.[section] ?? DEFAULT_SECTIONS[section];
}
