"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/section-header";
import { fadeUp, stagger } from "@/lib/motion";
import { formatDate, isValidUrl } from "@/lib/utils";
import type { Certificate } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

export function Certificates({ items, locale = "en" }: { items: Certificate[]; locale?: Locale }) {
  if (!items?.length) return null;
  const t = dictionary[locale];

  const sorted = [...items].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  );

  return (
    <section id="certificates" className="relative py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow={t.certificates.eyebrow}
          title={t.certificates.title}
          description={t.certificates.description}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sorted.map((c) => (
            <motion.article
              key={c.id}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow] [transition-duration:200ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:border-foreground/25 hover:shadow-md"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  {isValidUrl(c.pdfUrl) && (
                    <Badge variant="default" className="gap-1">
                      <FileText className="h-3 w-3" />
                      PDF
                    </Badge>
                  )}
                </div>

                <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.issuer} · {formatDate(c.issueDate, locale)}
                </p>

                {c.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {c.skills.slice(0, 4).map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="rounded-md text-[10px] font-mono uppercase tracking-wider"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  {isValidUrl(c.pdfUrl) && (
                    <Link
                      href={c.pdfUrl!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:text-primary"
                    >
                      <Download className="h-3 w-3" />
                      {t.certificates.viewPdf}
                    </Link>
                  )}
                  {isValidUrl(c.credentialUrl) && (
                    <Link
                      href={c.credentialUrl!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t.certificates.verify}
                    </Link>
                  )}
                  {!isValidUrl(c.pdfUrl) && !isValidUrl(c.credentialUrl) && (
                    <span className="text-xs text-muted-foreground">
                      {t.certificates.noPublicLink}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
