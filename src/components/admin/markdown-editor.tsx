"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function MarkdownEditor({
  value,
  onChange,
  rows = 12,
  label = "Content",
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  label?: string;
}) {
  const [tab, setTab] = useState("edit");
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Tabs value={tab} onValueChange={setTab} className="">
          <TabsList className="h-8 rounded-full">
            <TabsTrigger value="edit" className="h-6 rounded-full px-3 text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-6 rounded-full px-3 text-xs">
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsContent value="edit" className="mt-0">
          <Textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write in Markdown, headings, lists, code, links…"
            className="font-mono text-sm"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[300px] rounded-lg border border-input bg-card p-4 shadow-sm">
            <div className="prose prose-invert max-w-none prose-headings:font-display prose-pre:rounded-lg prose-pre:border prose-pre:border-border">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value || "_Preview will render here._"}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
