"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart-container";

const data = [
  { month: "Sep", value: 5.1 },
  { month: "Oct", value: 5.4 },
  { month: "Nov", value: 5.6 },
  { month: "Dec", value: 5.8 },
  { month: "Jan", value: 6.1 },
  { month: "Feb", value: 6.4 },
  { month: "Mar", value: 6.7 }
];

export function PortfolioGrowthChart() {
  return (
    <ChartContainer title="Portfolio growth" description="Blended portfolio value in crores across the past seven months.">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#059669" fill="url(#portfolioFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
