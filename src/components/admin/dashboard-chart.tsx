"use client";

import type { Project, Post } from "@/lib/types";

function bucketByMonth(items: { createdAt: string }[]) {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = d.toLocaleString("en-US", { month: "short" });
    map.set(k, 0);
  }
  for (const it of items) {
    const d = new Date(it.createdAt);
    const k = d.toLocaleString("en-US", { month: "short" });
    if (map.has(k)) map.set(k, (map.get(k) || 0) + 1);
  }
  return Array.from(map.entries()).map(([month, count]) => ({ month, count }));
}

export function DashboardChart({
  projects,
  posts,
}: {
  projects: Project[];
  posts: Post[];
}) {
  const pData = bucketByMonth(projects);
  const bData = bucketByMonth(posts);
  const data = pData.map((p, i) => ({
    month: p.month,
    projects: p.count,
    posts: bData[i]?.count || 0,
  }));

  const width = 640;
  const height = 220;
  const padding = { top: 16, right: 20, bottom: 34, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...data.flatMap((d) => [d.projects, d.posts]));

  function pointsFor(key: "projects" | "posts") {
    return data
      .map((d, i) => {
        const x = padding.left + (chartWidth * i) / Math.max(1, data.length - 1);
        const y = padding.top + chartHeight - (d[key] / maxValue) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div className="h-full w-full" aria-label="Content activity chart" role="img">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        {[0, 0.5, 1].map((tick) => {
          const y = padding.top + chartHeight - tick * chartHeight;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeDasharray="4 6"
              />
              <text x="0" y={y + 4} className="fill-muted-foreground text-[11px]">
                {Math.round(maxValue * tick)}
              </text>
            </g>
          );
        })}

        <polyline
          points={pointsFor("projects")}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={pointsFor("posts")}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => {
          const x = padding.left + (chartWidth * i) / Math.max(1, data.length - 1);
          return (
            <text
              key={d.month}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {d.month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
