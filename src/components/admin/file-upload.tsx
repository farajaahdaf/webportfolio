"use client";

import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  FileText,
  ImageIcon,
  X,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
  className?: string;
};

export function FileUpload({
  value,
  onChange,
  accept = "application/pdf,image/png,image/jpeg,image/webp,image/gif",
  label = "Upload file",
  hint = "PDF or image, up to 20 MB",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) upload(f);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  }

  const isPdf = value?.toLowerCase().endsWith(".pdf");
  const isImage =
    value && /\.(png|jpe?g|webp|gif)$/i.test(value);

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onPickFile}
        className="sr-only"
      />
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-describedby={hintId}
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center shadow-sm transition-all hover:border-foreground/30 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-70",
          drag && "border-primary bg-secondary"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors group-hover:text-primary">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </div>
        <p className="text-sm font-medium">
          {busy ? "Uploading…" : drag ? "Drop the file here" : label}
        </p>
        <p id={hintId} className="text-[10px] text-muted-foreground">{hint}</p>
      </button>

      {value && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
            {isPdf ? (
              <FileText className="h-4 w-4" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-xs font-medium text-foreground hover:text-primary"
            >
              {value}
            </a>
            <p className="text-[10px] text-muted-foreground">
              {isPdf ? "PDF document" : isImage ? "Image" : "File"} · click to open
            </p>
          </div>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Open file"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive cursor-pointer"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a URL"
        className="h-9 text-xs"
      />
    </div>
  );
}
