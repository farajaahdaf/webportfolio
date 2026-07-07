import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { SettingsManager } from "./settings-manager";

export const metadata = { title: "Settings" };

export default async function Page() {
  if (!(await getSession())) redirect("/admin/login");
  const settings = await getSettings();
  return <SettingsManager initial={settings} />;
}
