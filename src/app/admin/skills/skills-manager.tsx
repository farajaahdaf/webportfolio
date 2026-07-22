"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataList, type ColumnDef } from "@/components/admin/data-list";
import { PageHeader } from "@/components/admin/page-header";
import { TechIcon } from "@/components/site/tech-icon";
import { bindField, bindNumberField } from "@/lib/admin-form";
import type { Skill } from "@/lib/types";

const categories: Skill["category"][] = [
  "Frontend",
  "Backend",
  "AI/ML",
  "DevOps",
  "Database",
  "Tools",
];

const columns: ColumnDef<Skill>[] = [
  {
    key: "name",
    label: "Name",
    render: (r) => (
      <div className="flex items-center gap-3">
        <TechIcon slug={r.icon} color={r.color} name={r.name} size={16} className="h-8 w-8" />
        <span className="font-medium">{r.name}</span>
      </div>
    ),
  },
  {
    key: "category",
    label: "Category",
    render: (r) => <Badge variant="glass">{r.category}</Badge>,
  },
  {
    key: "proficiency",
    label: "Proficiency",
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${r.proficiency}%` }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {r.proficiency}%
        </span>
      </div>
    ),
  },
  {
    key: "years",
    label: "Years",
    render: (r) => <span className="font-mono text-xs">{r.years ?? "-"}</span>,
  },
];

export function SkillsManager() {
  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Skills"
        description="Manage technologies and proficiency levels shown on the site."
      />
      <DataList<Skill>
        endpoint="/api/skills"
        title="Skills"
        columns={columns}
        searchKeys={["name", "category"]}
        newDefaults={() => ({
          name: "",
          category: "Frontend",
          proficiency: 80,
          years: 1,
          icon: "",
          color: "",
        })}
        renderForm={(state, setState) => (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={state.name || ""} onChange={bindField(setState, "name")} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={state.category || "Frontend"}
                  onValueChange={(v) =>
                    setState((s) => ({ ...s, category: v as Skill["category"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label>Proficiency ({state.proficiency || 0}%)</Label>
                <Input
                  type="range"
                  min={0}
                  max={100}
                  value={state.proficiency || 0}
                  onChange={bindNumberField(setState, "proficiency")}
                  className="cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Years of experience</Label>
                <Input
                  type="number"
                  min={0}
                  value={state.years ?? 0}
                  onChange={bindNumberField(setState, "years")}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Icon (Simple Icons slug)</Label>
                <Input
                  value={state.icon || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, icon: e.target.value.trim() }))
                  }
                  placeholder="e.g. laravel, nextdotjs, react"
                />
                <p className="text-[10px] text-muted-foreground">
                  Browse slugs at simpleicons.org. Leave empty to use a monogram fallback.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Color (optional hex)</Label>
                <Input
                  value={state.color || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, color: e.target.value.replace("#", "").trim() }))
                  }
                  placeholder="FF2D20"
                />
              </div>
            </div>

            {(state.icon || state.name) && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
                <TechIcon
                  slug={state.icon}
                  color={state.color}
                  name={state.name || "?"}
                  size={24}
                  className="h-10 w-10"
                />
                <div>
                  <p className="text-sm font-medium">{state.name || "Preview"}</p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {state.icon ? `slug: ${state.icon}` : "no icon, monogram fallback"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
