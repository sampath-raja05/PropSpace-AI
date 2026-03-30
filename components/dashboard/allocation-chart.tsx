"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartContainer } from "@/components/ui/chart-container";
import type { DashboardChartSeries } from "@/types";

const palette = ["#059669", "#10b981", "#14b8a6", "#34d399"];

export function AllocationChart({
  data,
  title,
  description
}: {
  data: DashboardChartSeries[];
  title: string;
  description: string;
}) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={110} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
