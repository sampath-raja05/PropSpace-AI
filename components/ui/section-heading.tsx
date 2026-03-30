import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="hero-chip">{eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-base text-muted-foreground sm:text-lg">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
