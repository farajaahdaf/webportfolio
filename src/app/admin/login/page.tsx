import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_70%_42%_at_50%_0%,hsl(var(--secondary)/0.62),transparent_72%)]" />
      </div>
      <LoginForm />
    </div>
  );
}
