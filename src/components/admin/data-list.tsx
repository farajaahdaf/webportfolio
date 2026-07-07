"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Search, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type AnyRecord = Record<string, unknown> & { id: string };

export type ColumnDef<T extends AnyRecord> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function DataList<T extends AnyRecord>({
  endpoint,
  columns,
  newDefaults,
  renderForm,
  searchKeys,
  title = "Items",
}: {
  endpoint: string;
  columns: ColumnDef<T>[];
  newDefaults: () => Partial<T>;
  renderForm: (
    state: Partial<T>,
    setState: (
      updater: Partial<T> | ((prev: Partial<T>) => Partial<T>)
    ) => void
  ) => React.ReactNode;
  searchKeys: (keyof T)[];
  title?: string;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter((r) =>
      searchKeys.some((k) => String(r[k] || "").toLowerCase().includes(n))
    );
  }, [items, q, searchKeys]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const isUpdate = !!editing.id;
      const res = await fetch(endpoint, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(isUpdate ? "Updated" : "Created");
      setEditing(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      const res = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setEditing(newDefaults())}
          variant="gradient"
          className="rounded-full"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No items yet. Click <span className="font-medium">New</span> to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-left">
                  {columns.map((c) => (
                    <th
                      key={String(c.key)}
                      className={`px-4 py-3 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground ${c.className || ""}`}
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-secondary/40"
                  >
                    {columns.map((c) => (
                      <td
                        key={String(c.key)}
                        className={`px-4 py-3 ${c.className || ""}`}
                      >
                        {c.render
                          ? c.render(r)
                          : String((r as Record<string, unknown>)[c.key as string] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(r as Partial<T>)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
                          aria-label="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive cursor-pointer"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-md"
          onClick={() => setEditing(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                {editing.id ? "Edit" : "Create"}{" "}
                <span className="text-muted-foreground">/ {title}</span>
              </h2>
              <Badge variant="glass" className="font-mono">
                {editing.id ? "update" : "new"}
              </Badge>
            </div>
            <div className="mt-6 space-y-4">
              {renderForm(editing, (updater) => {
                setEditing((prev) => {
                  const base = prev ?? ({} as Partial<T>);
                  return typeof updater === "function"
                    ? (updater as (p: Partial<T>) => Partial<T>)(base)
                    : { ...base, ...updater };
                });
              })}
            </div>
            <div className="mt-8 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving} variant="gradient">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
