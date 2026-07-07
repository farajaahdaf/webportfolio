import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin · Faraja Ahdaf", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="relative min-h-screen bg-background">
      {session ? <AdminShell user={session}>{children}</AdminShell> : children}
    </div>
  );
}
