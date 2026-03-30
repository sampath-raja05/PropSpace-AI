import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cn("section-shell pb-16 pt-8 sm:pb-20", className)}>{children}</main>;
}
