"use client";

import { useDeferredValue } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, LineChart, Map, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { FilterSidebar } from "@/components/properties/filter-sidebar";
import { PropertyCard } from "@/components/properties/property-card";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSearchStore } from "@/store/search-store";
import type { Property } from "@/types";
import { cn, formatCompactCurrency, formatScore } from "@/lib/utils";

function matchesFilters(property: Property, query: string, filters: ReturnType<typeof useSearchStore.getState>["filters"]) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery =
    normalizedQuery.length === 0 ||
    [property.title, property.city, property.locality, property.builderName, property.description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

  return (
    matchesQuery &&
    (filters.city == null || property.city === filters.city) &&
    (filters.propertyType === "all" || property.propertyType === filters.propertyType) &&
    property.price >= filters.minPrice &&
    property.price <= filters.maxPrice &&
    (filters.bhk == null || property.bhk >= filters.bhk) &&
    (filters.furnishing === "all" || property.furnishing === filters.furnishing) &&
    (filters.possession === "all" || property.possession === filters.possession) &&
    (!filters.verifiedOnly || property.verified) &&
    property.aiInvestmentScore >= filters.minAiScore
  );
}

export function HomeExperience({ properties }: { properties: Property[] }) {
  const { filters } = useSearchStore();
  const deferredQuery = useDeferredValue(filters.query);
  const filteredProperties = properties.filter((property) => matchesFilters(property, deferredQuery, filters));
  const featuredMarkets = properties
    .slice()
    .sort((left, right) => right.aiInvestmentScore - left.aiInvestmentScore)
    .slice(0, 3);
  const cityOptions = Array.from(new Set(properties.map((property) => property.city)));
  const verifiedCount = properties.filter((property) => property.verified).length;
  const averageAiScore = properties.reduce((total, property) => total + property.aiInvestmentScore, 0) / properties.length;

  return (
    <div className="space-y-14 pb-14 sm:space-y-16 sm:pb-16">
      <section className="section-shell pt-6 sm:pt-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div>
            <p className="hero-chip">AI-driven property discovery for India</p>
            <h1 className="mt-5 max-w-3xl text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Invest with calm clarity, not spreadsheet chaos.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
              Search, compare, map, and evaluate premium real estate opportunities with AI-guided pricing,
              neighborhood scoring, and portfolio-aware decision support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="#discover"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/map"
                className="glass-card inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                Open full-screen map
                <Map className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                { label: "Live properties", value: properties.length.toString(), icon: Building2 },
                { label: "Verified listings", value: verifiedCount.toString(), icon: ShieldCheck },
                { label: "Average AI score", value: `${formatScore(averageAiScore)}/100`, icon: LineChart }
              ].map((item) => (
                <GlassCard key={item.label} className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel overflow-hidden bg-hero-radial p-5 sm:p-6 dark:bg-hero-radial-dark"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top opportunity now</p>
                <h2 className="mt-3 text-2xl sm:text-3xl">{featuredMarkets[0]?.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {featuredMarkets[0]?.locality}, {featuredMarkets[0]?.city}
                </p>
              </div>
              <div className="w-fit rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                AI {featuredMarkets[0] ? formatScore(featuredMarkets[0].aiInvestmentScore) : "--"}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {featuredMarkets.map((property, index) => (
                <div
                  key={property.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-[24px] border border-white/25 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
                    index === 0 ? "bg-white/70 dark:bg-slate-900/60" : "bg-white/45 dark:bg-slate-900/35"
                  )}
                >
                  <div>
                    <p className="text-lg font-semibold leading-tight">{property.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.city} | {property.propertyType}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-lg font-semibold">{formatCompactCurrency(property.price)}</p>
                    <p className="text-sm text-muted-foreground">{formatScore(property.aiInvestmentScore)}/100</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Premium search flows",
              description: "Price, BHK, furnishing, possession, AI score, and verified inventory in one clean interface."
            },
            {
              title: "Spatial decision-making",
              description: "A full-screen map with clustered prices and polygon search for real neighborhood-level exploration."
            },
            {
              title: "Actionable AI insights",
              description: "Predicted value, overpricing flags, comparables, portfolio context, and downloadable reports."
            }
          ].map((feature) => (
            <GlassCard key={feature.title} className="p-6">
              <h2 className="text-2xl">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="discover" className="section-shell space-y-8">
        <SectionHeading
          eyebrow="Discover"
          title="Curated property space"
          description="Refine the market down to the exact blend of city, ticket size, inventory type, and investment posture you want."
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <FilterSidebar cities={cityOptions} />
          <div id="property-results" className="scroll-mt-28 space-y-6">
            <GlassCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Search results</p>
                <h3 className="mt-2 text-2xl">{filteredProperties.length} listings match your strategy</h3>
              </div>
              <div className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                {cityOptions.length} cities covered
              </div>
            </GlassCard>

            {filteredProperties.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <GlassCard className="p-6 sm:p-7">
                <p className="hero-chip">No matches</p>
                <h3 className="mt-4 text-2xl">No listing fits this exact mix yet.</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Loosen one or two filters, especially city, AI score, or price ceiling, to open up nearby opportunities.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
