"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

import { ChartContainer } from "@/components/ui/chart-container";
import type { NeighborhoodScore } from "@/types";

export function NeighborhoodScoreChart({ data }: { data: NeighborhoodScore[] }) {
  return (
    <ChartContainer
      title="Neighborhood score"
      description="Each score is shown as a percentage, where higher means a stronger neighborhood signal for that factor."
      contentClassName="h-auto"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="rgba(148,163,184,0.18)" />
              <PolarAngleAxis dataKey="label" tick={{ fill: "currentColor", fontSize: 12 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="rgb(16, 185, 129)"
                fill="rgba(16, 185, 129, 0.28)"
                fillOpacity={1}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((item) => (
            <div key={item.label} className="rounded-[22px] bg-white/55 p-4 dark:bg-slate-800/45">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-primary">{item.score}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
}
