"use client";

export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_70%_42%_at_50%_0%,hsl(var(--secondary)/0.62),transparent_72%)]" />
      <div className="noise-overlay" />
    </div>
  );
}
