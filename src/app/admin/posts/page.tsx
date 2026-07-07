import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PostsManager } from "./posts-manager";

export const metadata = { title: "Blog posts" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  return <PostsManager />;
}
