import {
  type LucideIcon,
  Code2,
  Brain,
  Cpu,
  Server,
  Layers,
  Cloud,
  Microscope,
  Sparkles,
  Award,
  Briefcase,
  FlaskConical,
  Database,
  Rocket,
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  GraduationCap,
  FolderGit2,
} from "lucide-react";
import type { Experience } from "./types";

/** Looks up `key` in a registry, falling back when absent. Callers normalize casing (registries vary: exact component names vs. lowercase slugs). */
export function iconFor(map: Record<string, LucideIcon>, key: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!key) return fallback;
  return map[key] || fallback;
}

/** Icons for `settings.about.expertise[].icon` (see about.tsx). Falls back to Sparkles. */
export const expertiseIcons: Record<string, LucideIcon> = {
  Code2,
  Brain,
  Cpu,
  Server,
  Layers,
  Cloud,
  Microscope,
  Sparkles,
  Award,
  Briefcase,
  FlaskConical,
  Database,
  Rocket,
};

/** Icons for `Social.platform` (see contact.tsx). Falls back to Globe. */
export const socialIcons: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  mail: Mail,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
};

/** Icons for `Experience.type` (see experience.tsx). Exhaustive over the closed union, no fallback needed. */
export const experienceTypeIcons: Record<Experience["type"], LucideIcon> = {
  Work: Briefcase,
  Education: GraduationCap,
  Research: FlaskConical,
  Project: FolderGit2,
};
