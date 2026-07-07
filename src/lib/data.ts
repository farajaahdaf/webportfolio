import "server-only";
import { readCollection } from "./db";
import type {
  Project,
  Post,
  Skill,
  Experience,
  Certificate,
  Social,
} from "./types";

export async function getProjects(): Promise<Project[]> {
  return readCollection("projects");
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await readCollection("projects");
  return all.filter((p) => p.status === "published");
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await readCollection("projects");
  return all.find((p) => p.slug === slug) || null;
}

export async function getPosts(): Promise<Post[]> {
  return readCollection("posts");
}

export async function getPublishedPosts(): Promise<Post[]> {
  const all = await readCollection("posts");
  return all
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await readCollection("posts");
  return all.find((p) => p.slug === slug) || null;
}

export async function getSkills(): Promise<Skill[]> {
  return readCollection("skills");
}

export async function getExperience(): Promise<Experience[]> {
  return readCollection("experience");
}

export async function getCertificates(): Promise<Certificate[]> {
  return readCollection("certificates");
}

export async function getSocials(): Promise<Social[]> {
  const all = await readCollection("socials");
  return all.filter((s) => s.visible);
}
