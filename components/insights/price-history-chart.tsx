"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart-container";
import type { PriceHistoryPoint } from "@/types";
import { formatCompactCurrency } from "@/lib/utils";

export function PriceHistoryChart({ data }: { data: PriceHistoryPoint[] }) {
  return (
    <ChartContainer title="Price history" description="Recent momentum across the last eight months.">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" stroke="rgba(148,163,184,0.8)" tickLine={false} axisLine={false} />
          <YAxis
            stroke="rgba(148,163,184,0.8)"
            tickFormatter={(value) => formatCompactCurrency(value)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
          <Line type="monotone" dataKey="price" stroke="rgb(5, 150, 105)" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
