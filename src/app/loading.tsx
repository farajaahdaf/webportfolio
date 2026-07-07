export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
}
