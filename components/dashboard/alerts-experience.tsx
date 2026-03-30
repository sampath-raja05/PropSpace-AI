import { BellRing, ChartNoAxesCombined, Zap } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import type { AlertRule } from "@/types";

const icons = [BellRing, ChartNoAxesCombined, Zap];

export function AlertsExperience({ alerts }: { alerts: AlertRule[] }) {
  return (
    <div className="space-y-8">
      <GlassCard className="p-6">
        <p className="hero-chip">Alerts</p>
        <h1 className="mt-3 text-4xl">Stay ahead of the next move</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Configure triggers for underpriced inventory, launch activity, and yield shifts so your pipeline stays fresh without constant manual monitoring.
        </p>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {alerts.map((alert, index) => {
          const Icon = icons[index % icons.length];
          return (
            <GlassCard key={alert.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    alert.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "bg-slate-500/10 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
              <h2 className="mt-4 text-2xl">{alert.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{alert.city}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{alert.trigger}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Created {alert.createdAt}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
