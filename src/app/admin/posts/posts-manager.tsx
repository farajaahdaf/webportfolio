"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import type { Post } from "@/lib/types";

const columns: ColumnDef<Post>[] = [
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
    key: "tags",
    label: "Tags",
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.tags.slice(0, 3).map((t) => (
          <Badge key={t} variant="outline" className="text-[10px] font-mono">
            {t}
          </Badge>
        ))}
      </div>
    ),
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
  {
    key: "publishedAt",
    label: "Published",
    render: (r) =>
      r.publishedAt ? (
        <span className="text-xs text-muted-foreground">
          {new Date(r.publishedAt).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
];

export function PostsManager() {
  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Blog Posts"
        description="Write, edit, and publish posts with full Markdown support."
      />
      <DataList<Post>
        endpoint="/api/posts"
        title="Posts"
        columns={columns}
        searchKeys={["title", "slug", "category"]}
        newDefaults={() => ({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          cover:
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=80",
          tags: [],
          category: "Engineering",
          status: "draft",
          featured: false,
        })}
        renderForm={(state, setState) => (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={state.title || ""} onChange={bindField(setState, "title")} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  value={state.slug || ""}
                  onChange={bindField(setState, "slug")}
                  placeholder="auto-from-title"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea rows={2} value={state.excerpt || ""} onChange={bindField(setState, "excerpt")} />
            </div>

            <MarkdownEditor
              value={state.content || ""}
              onChange={(v) => setState((s) => ({ ...s, content: v }))}
            />

            <TranslationCard>
              <div className="space-y-1.5">
                <Label>Title ID</Label>
                <Input
                  value={idTranslation(state, "title")}
                  onChange={bindIdTranslation(setState, "title")}
                  placeholder="Judul tulisan"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Excerpt ID</Label>
                <Textarea
                  rows={2}
                  value={idTranslation(state, "excerpt")}
                  onChange={bindIdTranslation(setState, "excerpt")}
                />
              </div>
              <MarkdownEditor
                label="Content ID"
                value={idTranslation(state, "content")}
                onChange={bindIdTranslationValue(setState, "content")}
              />
            </TranslationCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={state.category || ""}
                  onChange={bindField(setState, "category")}
                  placeholder="Engineering, AI/ML, etc."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={joinList(state.tags)}
                  onChange={bindListField(setState, "tags")}
                  placeholder="NLP, Next.js, ..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Cover image</Label>
              <FileUpload
                value={state.cover}
                onChange={(url) => setState((s) => ({ ...s, cover: url }))}
                accept="image/png,image/jpeg,image/webp"
                label="Upload cover"
                hint="PNG, JPG or WEBP recommended 1600×900"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>SEO title</Label>
                <Input value={state.seoTitle || ""} onChange={bindField(setState, "seoTitle")} />
              </div>
              <div className="space-y-1.5">
                <Label>SEO description</Label>
                <Input value={state.seoDescription || ""} onChange={bindField(setState, "seoDescription")} />
              </div>
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
                      publishedAt:
                        v && !state.publishedAt
                          ? new Date().toISOString()
                          : state.publishedAt,
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
