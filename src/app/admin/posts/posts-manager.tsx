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
                <Input
                  value={state.title || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  value={state.slug || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, slug: e.target.value }))
                  }
                  placeholder="auto-from-title"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                rows={2}
                value={state.excerpt || ""}
                onChange={(e) =>
                  setState((s) => ({ ...s, excerpt: e.target.value }))
                }
              />
            </div>

            <MarkdownEditor
              value={state.content || ""}
              onChange={(v) => setState((s) => ({ ...s, content: v }))}
            />

            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="mb-4">
                <h3 className="font-display text-sm font-semibold tracking-tight">
                  Indonesian translation
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional. Used when visitors choose Bahasa Indonesia. Empty fields fall back to the default content.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Title ID</Label>
                <Input
                  value={state.translations?.id?.title || ""}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      translations: {
                        ...s.translations,
                        id: { ...s.translations?.id, title: e.target.value },
                      },
                    }))
                  }
                  placeholder="Judul tulisan"
                />
              </div>
              <div className="mt-4 space-y-1.5">
                <Label>Excerpt ID</Label>
                <Textarea
                  rows={2}
                  value={state.translations?.id?.excerpt || ""}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      translations: {
                        ...s.translations,
                        id: { ...s.translations?.id, excerpt: e.target.value },
                      },
                    }))
                  }
                />
              </div>
              <div className="mt-4">
                <MarkdownEditor
                  label="Content ID"
                  value={state.translations?.id?.content || ""}
                  onChange={(v) =>
                    setState((s) => ({
                      ...s,
                      translations: {
                        ...s.translations,
                        id: { ...s.translations?.id, content: v },
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={state.category || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, category: e.target.value }))
                  }
                  placeholder="Engineering, AI/ML, etc."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={(state.tags || []).join(", ")}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    }))
                  }
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
                <Input
                  value={state.seoTitle || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, seoTitle: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>SEO description</Label>
                <Input
                  value={state.seoDescription || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, seoDescription: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={!!state.featured}
                  onCheckedChange={(v) =>
                    setState((s) => ({ ...s, featured: !!v }))
                  }
                />
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
