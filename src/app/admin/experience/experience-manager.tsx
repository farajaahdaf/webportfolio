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
import { PageHeader } from "@/components/admin/page-header";
import type { Experience } from "@/lib/types";

const types: Experience["type"][] = ["Work", "Education", "Research", "Project"];

const columns: ColumnDef<Experience>[] = [
  {
    key: "role",
    label: "Role",
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.role}</span>
        <span className="text-xs text-muted-foreground">{r.organization}</span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (r) => <Badge variant="glass">{r.type}</Badge>,
  },
  {
    key: "startDate",
    label: "Period",
    render: (r) => (
      <span className="font-mono text-xs">
        {new Date(r.startDate).getFullYear()} -{" "}
        {r.current ? "present" : r.endDate ? new Date(r.endDate).getFullYear() : ""}
      </span>
    ),
  },
];

export function ExperienceManager() {
  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Experience"
        description="Roles, education, research, and notable projects on your timeline."
      />
      <DataList<Experience>
        endpoint="/api/experience"
        title="Experience"
        columns={columns}
        searchKeys={["role", "organization", "type"]}
        newDefaults={() => ({
          role: "",
          organization: "",
          type: "Work",
          location: "",
          startDate: new Date().toISOString().slice(0, 10),
          current: true,
          description: "",
          achievements: [],
          tech: [],
        })}
        renderForm={(state, setState) => (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                  value={state.role || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, role: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Organization</Label>
                <Input
                  value={state.organization || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, organization: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={state.type || "Work"}
                  onValueChange={(v) =>
                    setState((s) => ({ ...s, type: v as Experience["type"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input
                  value={state.location || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, location: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={
                    state.startDate ? state.startDate.slice(0, 10) : ""
                  }
                  onChange={(e) =>
                    setState((s) => ({ ...s, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End date</Label>
                <Input
                  type="date"
                  value={state.endDate ? state.endDate.slice(0, 10) : ""}
                  disabled={state.current}
                  onChange={(e) =>
                    setState((s) => ({ ...s, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="current"
                checked={!!state.current}
                onCheckedChange={(v) =>
                  setState((s) => ({
                    ...s,
                    current: !!v,
                    endDate: v ? undefined : s.endDate,
                  }))
                }
              />
              <Label htmlFor="current">Current role</Label>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={state.description || ""}
                onChange={(e) =>
                  setState((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Achievements (one per line)</Label>
              <Textarea
                rows={4}
                value={(state.achievements || []).join("\n")}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    achievements: e.target.value
                      .split("\n")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tech (comma separated)</Label>
              <Input
                value={(state.tech || []).join(", ")}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  }))
                }
              />
            </div>
          </>
        )}
      />
    </div>
  );
}
