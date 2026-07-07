import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SkillsManager } from "./skills-manager";

export const metadata = { title: "Skills" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  return <SkillsManager />;
}
