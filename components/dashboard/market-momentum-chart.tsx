"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart-container";
import type { DashboardChartSeries } from "@/types";

export function MarketMomentumChart({ data }: { data: DashboardChartSeries[] }) {
  return (
    <ChartContainer title="Market momentum" description="AI-weighted market pulse across our strongest watch zones.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="rgb(5, 150, 105)" radius={[14, 14, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
