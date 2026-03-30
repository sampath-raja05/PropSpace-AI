import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

export function AIInsightCard({
  title,
  value,
  delta,
  tone = "neutral",
  description
}: {
  title: string;
  value: string | number;
  delta?: number;
  tone?: "positive" | "negative" | "neutral";
  description: string;
}) {
  const DeltaIcon = delta == null ? Minus : delta >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {typeof value === "number" ? formatCurrency(value) : value}
          </p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
            tone === "positive" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
            tone === "negative" && "bg-rose-500/10 text-rose-600 dark:text-rose-300",
            tone === "neutral" && "bg-primary/10 text-primary"
          )}
        >
          <DeltaIcon className="h-3.5 w-3.5" />
          {delta == null ? "Stable" : formatPercent(delta)}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
    </GlassCard>
  );
}
