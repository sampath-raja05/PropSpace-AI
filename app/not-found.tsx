import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotFound() {
  return (
    <PageShell className="py-16">
      <GlassCard className="mx-auto max-w-2xl p-8 text-center">
        <p className="hero-chip mx-auto w-fit">Not found</p>
        <h1 className="mt-4 text-4xl">That property space could not be found.</h1>
        <p className="mt-4 text-muted-foreground">
          The listing may have moved, or the link may be incomplete. You can head back to discovery and continue browsing.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Return home
        </Link>
      </GlassCard>
    </PageShell>
  );
}
