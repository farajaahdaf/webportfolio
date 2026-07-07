import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ExperienceManager } from "./experience-manager";

export const metadata = { title: "Experience" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  return <ExperienceManager />;
}
