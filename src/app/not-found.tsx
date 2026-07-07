import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 bg-radial-fade" />
      </div>
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Error 404
        </p>
        <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight text-gradient-static md:text-7xl">
          Lost in space.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          The page you&apos;re after doesn&apos;t exist, or it moved when no one was
          looking.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button asChild variant="gradient" className="rounded-full">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
              Projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
