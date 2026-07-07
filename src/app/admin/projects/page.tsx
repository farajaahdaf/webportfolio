import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ProjectsManager } from "./projects-manager";

export const metadata = { title: "Projects" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  return <ProjectsManager />;
}
