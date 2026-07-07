"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/admin/page-header";
import type { SiteSettings } from "@/lib/types";
import { DEFAULT_SECTIONS, type SectionKey } from "@/lib/sections";

const sectionOptions: Array<{
  key: SectionKey;
  label: string;
  description: string;
}> = [
  { key: "about", label: "About", description: "Profile summary and expertise cards." },
  { key: "skills", label: "Skills", description: "Technology and tools grid." },
  { key: "projects", label: "Projects", description: "Featured projects on the homepage." },
  { key: "experience", label: "Experience", description: "Timeline section." },
  { key: "certificates", label: "Certificates", description: "Credential cards." },
  { key: "blog", label: "Writing", description: "Writing preview, blog nav link, and blog pages." },
  { key: "contact", label: "Contact", description: "Contact section and contact CTA." },
];

export function SettingsManager({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Site Settings"
        description="Edit everything that appears on the public site, profile, hero, stats, contact, footer."
        action={
          <Button onClick={save} disabled={saving} variant="gradient" className="rounded-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="profile" className="rounded-xl">Profile</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-xl">Hero</TabsTrigger>
          <TabsTrigger value="about" className="rounded-xl">About</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-xl">Stats</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl">Contact</TabsTrigger>
          <TabsTrigger value="sections" className="rounded-xl">Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card title="Profile">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Display name">
                <Input
                  value={s.profile.name}
                  onChange={(e) =>
                    setS({ ...s, profile: { ...s.profile, name: e.target.value } })
                  }
                />
              </Field>
              <Field label="Title">
                <Input
                  value={s.profile.title}
                  onChange={(e) =>
                    setS({ ...s, profile: { ...s.profile, title: e.target.value } })
                  }
                  placeholder="Use · between segments"
                />
              </Field>
              <Field label="Location" className="md:col-span-1">
                <Input
                  value={s.profile.location || ""}
                  onChange={(e) =>
                    setS({ ...s, profile: { ...s.profile, location: e.target.value } })
                  }
                />
              </Field>
              <Field label="Availability blurb">
                <Input
                  value={s.profile.availability || ""}
                  onChange={(e) =>
                    setS({ ...s, profile: { ...s.profile, availability: e.target.value } })
                  }
                />
              </Field>
              <Field label="Resume URL">
                <Input
                  value={s.profile.resumeUrl || ""}
                  onChange={(e) =>
                    setS({ ...s, profile: { ...s.profile, resumeUrl: e.target.value } })
                  }
                  placeholder="/resume.pdf or https://..."
                />
              </Field>
              <Field label="Avatar URL (optional)">
                <Input
                  value={s.profile.avatar || ""}
                  onChange={(e) =>
                    setS({ ...s, profile: { ...s.profile, avatar: e.target.value } })
                  }
                />
              </Field>
            </div>
            <Field label="Tagline (hero subtitle)" className="mt-4">
              <Textarea
                rows={2}
                value={s.profile.tagline}
                onChange={(e) =>
                  setS({ ...s, profile: { ...s.profile, tagline: e.target.value } })
                }
              />
            </Field>
            <Field label="Short description" className="mt-4">
              <Textarea
                rows={3}
                value={s.profile.description}
                onChange={(e) =>
                  setS({ ...s, profile: { ...s.profile, description: e.target.value } })
                }
              />
            </Field>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="mt-6">
          <Card title="Hero badge & CTAs">
            <Field label="Badge text">
              <Input
                value={s.hero.badge || ""}
                onChange={(e) => setS({ ...s, hero: { ...s.hero, badge: e.target.value } })}
              />
            </Field>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <CtaEditor
                label="Primary CTA"
                value={s.hero.primaryCta}
                onChange={(v) => setS({ ...s, hero: { ...s.hero, primaryCta: v } })}
              />
              <CtaEditor
                label="Secondary CTA"
                value={s.hero.secondaryCta}
                onChange={(v) => setS({ ...s, hero: { ...s.hero, secondaryCta: v } })}
              />
              <CtaEditor
                label="Tertiary CTA"
                value={s.hero.tertiaryCta}
                onChange={(v) => setS({ ...s, hero: { ...s.hero, tertiaryCta: v } })}
              />
            </div>
          </Card>

          <Card title="Tech ribbon" className="mt-4">
            <p className="mb-3 text-xs text-muted-foreground">
              The marquee row of tech under the hero. One per line.
            </p>
            <Textarea
              rows={8}
              value={s.hero.techRibbon.join("\n")}
              onChange={(e) =>
                setS({
                  ...s,
                  hero: {
                    ...s.hero,
                    techRibbon: e.target.value
                      .split("\n")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card title="About section text">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Eyebrow">
                <Input
                  value={s.about.eyebrow}
                  onChange={(e) =>
                    setS({ ...s, about: { ...s.about, eyebrow: e.target.value } })
                  }
                />
              </Field>
              <Field label="Section title" className="md:col-span-2">
                <Input
                  value={s.about.title}
                  onChange={(e) =>
                    setS({ ...s, about: { ...s.about, title: e.target.value } })
                  }
                />
              </Field>
            </div>
            <Field label="Description" className="mt-4">
              <Textarea
                rows={3}
                value={s.about.description}
                onChange={(e) =>
                  setS({ ...s, about: { ...s.about, description: e.target.value } })
                }
              />
            </Field>
          </Card>

          <Card title="Expertise cards" className="mt-4">
            <p className="mb-3 text-xs text-muted-foreground">
              Edit the cards under About. Icon names come from{" "}
              <code className="font-mono text-primary">lucide-react</code>: e.g.
              Layers, Brain, Cpu, Server, Code2, Cloud, Microscope, Sparkles, Database, Rocket.
            </p>
            <div className="space-y-3">
              {s.about.expertise.map((ex, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-3 shadow-sm md:grid-cols-[140px_1fr_2fr_auto]"
                >
                  <Input
                    value={ex.icon}
                    onChange={(e) => {
                      const next = [...s.about.expertise];
                      next[i] = { ...next[i], icon: e.target.value };
                      setS({ ...s, about: { ...s.about, expertise: next } });
                    }}
                    placeholder="Icon name"
                  />
                  <Input
                    value={ex.title}
                    onChange={(e) => {
                      const next = [...s.about.expertise];
                      next[i] = { ...next[i], title: e.target.value };
                      setS({ ...s, about: { ...s.about, expertise: next } });
                    }}
                    placeholder="Title"
                  />
                  <Input
                    value={ex.blurb}
                    onChange={(e) => {
                      const next = [...s.about.expertise];
                      next[i] = { ...next[i], blurb: e.target.value };
                      setS({ ...s, about: { ...s.about, expertise: next } });
                    }}
                    placeholder="Short blurb"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = s.about.expertise.filter((_, j) => j !== i);
                      setS({ ...s, about: { ...s.about, expertise: next } });
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive cursor-pointer"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  setS({
                    ...s,
                    about: {
                      ...s.about,
                      expertise: [
                        ...s.about.expertise,
                        { icon: "Sparkles", title: "New area", blurb: "" },
                      ],
                    },
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add expertise
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card title="Stats row">
            <p className="mb-4 text-xs text-muted-foreground">
              Projects completed and Technologies mastered are computed automatically from published projects and skills. Edit the manual stats below.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Years of experience">
                <Input
                  type="number"
                  min={0}
                  value={s.about.stats.yearsExperience}
                  onChange={(e) =>
                    setS({
                      ...s,
                      about: {
                        ...s.about,
                        stats: {
                          ...s.about.stats,
                          yearsExperience: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </Field>
              <Field label="Research & experiments">
                <Input
                  type="number"
                  min={0}
                  value={s.about.stats.researchCount}
                  onChange={(e) =>
                    setS({
                      ...s,
                      about: {
                        ...s.about,
                        stats: {
                          ...s.about.stats,
                          researchCount: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </Field>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card title="Contact section">
            <Field label="Public email">
              <Input
                value={s.contact.email}
                onChange={(e) =>
                  setS({ ...s, contact: { ...s.contact, email: e.target.value } })
                }
              />
            </Field>
            <Field label="Blurb (shown above the form)" className="mt-4">
              <Textarea
                rows={3}
                value={s.contact.blurb}
                onChange={(e) =>
                  setS({ ...s, contact: { ...s.contact, blurb: e.target.value } })
                }
              />
            </Field>
          </Card>

          <Card title="Footer" className="mt-4">
            <Field label="Footer tagline">
              <Textarea
                rows={3}
                value={s.footer.tagline}
                onChange={(e) =>
                  setS({ ...s, footer: { ...s.footer, tagline: e.target.value } })
                }
              />
            </Field>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="mt-6">
          <Card title="Archive sections">
            <p className="mb-4 text-sm text-muted-foreground">
              Turn a section off to hide it from the public site. Writing also hides the blog route.
            </p>
            <div className="space-y-3">
              {sectionOptions.map((section) => {
                const checked = s.sections?.[section.key] ?? DEFAULT_SECTIONS[section.key];
                return (
                  <div
                    key={section.key}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-medium">{section.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                    <Switch
                      checked={checked}
                      onCheckedChange={(next) =>
                        setS({
                          ...s,
                          sections: {
                            ...DEFAULT_SECTIONS,
                            ...s.sections,
                            [section.key]: next,
                          },
                        })
                      }
                      aria-label={`Toggle ${section.label}`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button onClick={save} disabled={saving} variant="gradient" className="rounded-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}
    >
      <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function CtaEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { label: string; href: string };
  onChange: (v: { label: string; href: string }) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-2">
        <Input
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
          placeholder="Button label"
        />
        <Input
          value={value.href}
          onChange={(e) => onChange({ ...value, href: e.target.value })}
          placeholder="/#projects or https://..."
        />
      </div>
    </div>
  );
}
