import { PageShell } from "@/components/layout/page-shell";

export default function GlobalLoading() {
  return (
    <PageShell className="space-y-6">
      <div className="animate-pulse space-y-6">
        <div className="rounded-[28px] border border-border bg-white/60 p-8 dark:bg-slate-900/60">
          <div className="h-4 w-32 rounded-full bg-muted" />
          <div className="mt-5 h-12 w-2/3 rounded-full bg-muted" />
          <div className="mt-4 h-4 w-1/2 rounded-full bg-muted" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-[28px] border border-border bg-white/60 p-6 dark:bg-slate-900/60">
              <div className="h-40 rounded-[24px] bg-muted" />
              <div className="mt-5 h-6 w-2/3 rounded-full bg-muted" />
              <div className="mt-3 h-4 w-1/2 rounded-full bg-muted" />
              <div className="mt-6 h-11 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
