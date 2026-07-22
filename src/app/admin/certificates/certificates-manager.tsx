"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataList, type ColumnDef } from "@/components/admin/data-list";
import { PageHeader } from "@/components/admin/page-header";
import { FileUpload } from "@/components/admin/file-upload";
import { FileText, ImageIcon } from "lucide-react";
import { bindField, bindListField, joinList } from "@/lib/admin-form";
import type { Certificate } from "@/lib/types";

const columns: ColumnDef<Certificate>[] = [
  {
    key: "title",
    label: "Certificate",
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium">{r.title}</span>
        <span className="text-xs text-muted-foreground">{r.issuer}</span>
      </div>
    ),
  },
  {
    key: "issueDate",
    label: "Issued",
    render: (r) => (
      <span className="font-mono text-xs">
        {new Date(r.issueDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "skills",
    label: "Skills",
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.skills.slice(0, 3).map((s) => (
          <Badge key={s} variant="outline" className="text-[10px] font-mono">
            {s}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "pdfUrl",
    label: "Files",
    render: (r) => (
      <div className="flex items-center gap-2">
        {r.pdfUrl ? (
          <a
            href={r.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-primary hover:border-foreground/30"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText className="h-3 w-3" /> PDF
          </a>
        ) : null}
        {r.image ? (
          <a
            href={r.image}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageIcon className="h-3 w-3" /> Image
          </a>
        ) : null}
        {!r.pdfUrl && !r.image && (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    ),
  },
];

export function CertificatesManager() {
  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Certificates"
        description="Manage credentials, upload PDF certificates or thumbnail images."
      />
      <DataList<Certificate>
        endpoint="/api/certificates"
        title="Certificates"
        columns={columns}
        searchKeys={["title", "issuer"]}
        newDefaults={() => ({
          title: "",
          issuer: "",
          issueDate: new Date().toISOString().slice(0, 10),
          credentialUrl: "",
          pdfUrl: "",
          image: "",
          skills: [],
        })}
        renderForm={(state, setState) => (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={state.title || ""} onChange={bindField(setState, "title")} />
              </div>
              <div className="space-y-1.5">
                <Label>Issuer</Label>
                <Input value={state.issuer || ""} onChange={bindField(setState, "issuer")} />
              </div>
              <div className="space-y-1.5">
                <Label>Issue date</Label>
                <Input
                  type="date"
                  value={state.issueDate ? state.issueDate.slice(0, 10) : ""}
                  onChange={bindField(setState, "issueDate")}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Credential verification URL</Label>
                <Input
                  value={state.credentialUrl || ""}
                  onChange={bindField(setState, "credentialUrl")}
                  placeholder="https://issuer.example/verify/..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Skills (comma separated)</Label>
              <Input value={joinList(state.skills)} onChange={bindListField(setState, "skills")} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Certificate PDF</Label>
                <FileUpload
                  value={state.pdfUrl}
                  onChange={(url) => setState((s) => ({ ...s, pdfUrl: url }))}
                  accept="application/pdf"
                  label="Upload PDF"
                  hint="PDF only, up to 20 MB"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Thumbnail image (optional)</Label>
                <FileUpload
                  value={state.image}
                  onChange={(url) => setState((s) => ({ ...s, image: url }))}
                  accept="image/png,image/jpeg,image/webp"
                  label="Upload image"
                  hint="PNG, JPG or WEBP"
                />
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}
