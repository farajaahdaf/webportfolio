import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CertificatesManager } from "./certificates-manager";

export const metadata = { title: "Certificates" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  return <CertificatesManager />;
}
