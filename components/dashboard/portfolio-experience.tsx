"use client";

import Link from "next/link";

import { PropertyCard } from "@/components/properties/property-card";
import { GlassCard } from "@/components/ui/glass-card";
import { usePortfolioStore } from "@/store/portfolio-store";
import type { PortfolioHolding, Property } from "@/types";
import { formatCompactCurrency } from "@/lib/utils";

export function PortfolioExperience({
  holdings,
  properties
}: {
  holdings: PortfolioHolding[];
  properties: Property[];
}) {
  const { watchlist } = usePortfolioStore();
  const watchedProperties = properties.filter((property) => watchlist.includes(property.id));

  return (
    <div className="space-y-10">
      <GlassCard className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="hero-chip">Portfolio tracking</p>
            <h1 className="mt-3 text-4xl">Capital deployment at a glance</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Monitor current value, benchmark against target yield, and keep your watchlist close while you compare new opportunities.
            </p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-primary">
            Open strategy dashboard
          </Link>
        </div>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {holdings.map((holding) => {
          const property = properties.find((candidate) => candidate.id === holding.propertyId);
          if (!property) {
            return null;
          }

          return (
            <GlassCard key={holding.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl">{property.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {property.locality}, {property.city}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">{holding.notes}</p>
                </div>
                <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Target yield {holding.targetYield.toFixed(1)}%
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[20px] bg-white/55 p-4 dark:bg-slate-800/45">
                  <p className="text-sm text-muted-foreground">Acquisition value</p>
                  <p className="mt-2 text-xl font-semibold">{formatCompactCurrency(holding.acquisitionValue)}</p>
                </div>
                <div className="rounded-[20px] bg-white/55 p-4 dark:bg-slate-800/45">
                  <p className="text-sm text-muted-foreground">Current value</p>
                  <p className="mt-2 text-xl font-semibold">{formatCompactCurrency(holding.currentValue)}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="space-y-6">
        <div>
          <p className="hero-chip">Watchlist</p>
          <h2 className="mt-3 text-3xl">Saved opportunities</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {watchedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}
