import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SocialsManager } from "./socials-manager";

export const metadata = { title: "Social Links" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  return <SocialsManager />;
}
