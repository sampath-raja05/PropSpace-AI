import type { ReactNode } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

export function ChartContainer({
  title,
  description,
  children,
  className,
  contentClassName
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <GlassCard className={cn("p-5 sm:p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className={cn("h-72", contentClassName)}>{children}</div>
    </GlassCard>
  );
}
