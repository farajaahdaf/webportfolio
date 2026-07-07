"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataList, type ColumnDef } from "@/components/admin/data-list";
import { PageHeader } from "@/components/admin/page-header";
import type { Social } from "@/lib/types";

const columns: ColumnDef<Social>[] = [
  {
    key: "platform",
    label: "Platform",
    render: (r) => <span className="font-medium">{r.platform}</span>,
  },
  {
    key: "handle",
    label: "Handle",
    render: (r) => (
      <span className="font-mono text-xs text-muted-foreground">
        {r.handle ?? "-"}
      </span>
    ),
  },
  {
    key: "url",
    label: "URL",
    render: (r) => (
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-primary hover:underline"
      >
        {r.url}
      </a>
    ),
  },
  {
    key: "visible",
    label: "Visible",
    render: (r) =>
      r.visible ? (
        <Badge variant="success">visible</Badge>
      ) : (
        <Badge variant="warning">hidden</Badge>
      ),
  },
];

export function SocialsManager() {
  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Social Links"
        description="Manage external profiles displayed in the footer and contact section."
      />
      <DataList<Social>
        endpoint="/api/socials"
        title="Socials"
        columns={columns}
        searchKeys={["platform", "url"]}
        newDefaults={() => ({
          platform: "",
          url: "",
          handle: "",
          visible: true,
        })}
        renderForm={(state, setState) => (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Platform</Label>
                <Input
                  value={state.platform || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, platform: e.target.value }))
                  }
                  placeholder="GitHub, LinkedIn…"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Handle (optional)</Label>
                <Input
                  value={state.handle || ""}
                  onChange={(e) =>
                    setState((s) => ({ ...s, handle: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input
                value={state.url || ""}
                onChange={(e) =>
                  setState((s) => ({ ...s, url: e.target.value }))
                }
                placeholder="https://…"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="visible"
                checked={!!state.visible}
                onCheckedChange={(v) =>
                  setState((s) => ({ ...s, visible: !!v }))
                }
              />
              <Label htmlFor="visible">Show on public site</Label>
            </div>
          </>
        )}
      />
    </div>
  );
}
