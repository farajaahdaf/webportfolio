export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  content: string;
  thumbnail: string;
  gallery?: string[];
  tech: string[];
  category: "Web" | "AI/ML" | "Mobile" | "DevOps" | "Research";
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  status: "draft" | "published";
  metrics?: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover?: string;
  tags: string[];
  category: string;
  status: "draft" | "published";
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type Skill = {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "AI/ML" | "DevOps" | "Database" | "Tools";
  proficiency: number; // 0-100
  /** Simple Icons slug (https://simpleicons.org) - e.g. "laravel", "nextdotjs", "react" */
  icon?: string;
  /** Optional accent hex without #, e.g. "FF2D20" for Laravel */
  color?: string;
  years?: number;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  type: "Work" | "Education" | "Research" | "Project";
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  tech?: string[];
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  pdfUrl?: string;
  image?: string;
  skills: string[];
};

export type Social = {
  id: string;
  platform: string;
  url: string;
  handle?: string;
  visible: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin";
  passwordHash: string;
};

export type SiteSettings = {
  profile: {
    name: string;
    title: string;
    tagline: string;
    description: string;
    avatar?: string;
    resumeUrl?: string;
    location?: string;
    availability?: string;
  };
  hero: {
    badge?: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    tertiaryCta: { label: string; href: string };
    techRibbon: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    expertise: { title: string; blurb: string; icon: string }[];
    stats: {
      yearsExperience: number;
      researchCount: number;
    };
  };
  contact: {
    email: string;
    blurb: string;
  };
  footer: {
    tagline: string;
  };
  sections: {
    about: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    certificates: boolean;
    blog: boolean;
    contact: boolean;
  };
};

export type DbSchema = {
  projects: Project[];
  posts: Post[];
  skills: Skill[];
  experience: Experience[];
  certificates: Certificate[];
  socials: Social[];
  users: User[];
};
