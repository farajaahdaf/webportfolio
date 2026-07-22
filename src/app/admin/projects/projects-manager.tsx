"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataList, type ColumnDef } from "@/components/admin/data-list";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { PageHeader } from "@/components/admin/page-header";
import { FileUpload } from "@/components/admin/file-upload";
import { TranslationCard } from "@/components/admin/translation-card";
import {
  bindChecked,
  bindField,
  bindIdTranslation,
  bindIdTranslationValue,
  bindListField,
  idTranslation,
  joinList,
} from "@/lib/admin-form";
import type { Project } from "@/lib/types";

const categories: Project["category"][] = [
  "Web",
  "AI/ML",
  "Mobile",
  "DevOps",
  "Research",
];

const columns: ColumnDef<Project>[] = [
  {
    key: "title",
    label: "Title",
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.title}</span>
        <span className="text-xs text-muted-foreground">/{r.slug}</span>
      </div>
    ),
  },
  {
    key: "category",
    label: "Category",
    render: (r) => <Badge variant="glass">{r.category}</Badge>,
  },
  {
    key: "tech",
    label: "Tech",
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.tech.slice(0, 3).map((t) => (
          <Badge key={t} variant="outline" className="text-[10px] font-mono">
            {t}
          </Badge>
        ))}
        {r.tech.length > 3 && (
          <Badge variant="outline" className="text-[10px] font-mono">
            +{r.tech.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: "featured",
    label: "Featured",
    render: (r) => (r.featured ? <Badge variant="default">Yes</Badge> : <span className="text-muted-foreground">-</span>),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <Badge variant={r.status === "published" ? "success" : "warning"}>
        {r.status}
      </Badge>
    ),
  },
];

export function ProjectsManager() {
  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Projects"
        description="Manage your portfolio's featured and all projects."
      />
      <DataList<Project>
        endpoint="/api/projects"
        title="Projects"
        columns={columns}
        searchKeys={["title", "slug", "category"]}
        newDefaults={() => ({
          title: "",
          slug: "",
          tagline: "",
          description: "",
          content: "",
          thumbnail:
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
          tech: [],
          category: "Web",
          featured: false,
          status: "draft",
        })}
        renderForm={(state, setState) => (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={state.title || ""}
                  onChange={bindField(setState, "title")}
                  placeholder="Project title"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (optional)</Label>
                <Input
                  value={state.slug || ""}
                  onChange={bindField(setState, "slug")}
                  placeholder="auto-from-title"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input
                value={state.tagline || ""}
                onChange={bindField(setState, "tagline")}
                placeholder="One-line description"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Short description</Label>
              <Textarea
                rows={3}
                value={state.description || ""}
                onChange={bindField(setState, "description")}
              />
            </div>

            <MarkdownEditor
              label="Case study"
              value={state.content || ""}
              onChange={(v) => setState((s) => ({ ...s, content: v }))}
            />

            <TranslationCard>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Title ID</Label>
                  <Input
                    value={idTranslation(state, "title")}
                    onChange={bindIdTranslation(setState, "title")}
                    placeholder="Judul proyek"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tagline ID</Label>
                  <Input
                    value={idTranslation(state, "tagline")}
                    onChange={bindIdTranslation(setState, "tagline")}
                    placeholder="Deskripsi satu baris"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Short description ID</Label>
                <Textarea
                  rows={3}
                  value={idTranslation(state, "description")}
                  onChange={bindIdTranslation(setState, "description")}
                />
              </div>
              <MarkdownEditor
                label="Case study ID"
                value={idTranslation(state, "content")}
                onChange={bindIdTranslationValue(setState, "content")}
              />
            </TranslationCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={state.category || "Web"}
                  onValueChange={(v) =>
                    setState((s) => ({ ...s, category: v as Project["category"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>GitHub URL</Label>
                <Input value={state.githubUrl || ""} onChange={bindField(setState, "githubUrl")} />
              </div>
              <div className="space-y-1.5">
                <Label>Live URL</Label>
                <Input value={state.liveUrl || ""} onChange={bindField(setState, "liveUrl")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Thumbnail</Label>
              <FileUpload
                value={state.thumbnail}
                onChange={(url) => setState((s) => ({ ...s, thumbnail: url }))}
                accept="image/png,image/jpeg,image/webp"
                label="Upload thumbnail"
                hint="PNG, JPG or WEBP recommended 1600×1000"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tech (comma separated)</Label>
              <Input
                value={joinList(state.tech)}
                onChange={bindListField(setState, "tech")}
                placeholder="Next.js, Tailwind, Python"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch id="featured" checked={!!state.featured} onCheckedChange={bindChecked(setState, "featured")} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={state.status === "published"}
                  onCheckedChange={(v) =>
                    setState((s) => ({
                      ...s,
                      status: v ? "published" : "draft",
                    }))
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}
