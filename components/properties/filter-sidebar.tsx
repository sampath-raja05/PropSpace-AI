"use client";

import { startTransition, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { defaultFilters, useSearchStore } from "@/store/search-store";
import { formatCompactCurrency } from "@/lib/utils";
import type { PropertyFilters } from "@/types";

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterSidebar({ cities }: { cities: string[] }) {
  const { filters, resetFilters, setFilters } = useSearchStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilters = (nextFilters: Partial<PropertyFilters>) => {
    startTransition(() => setFilters(nextFilters));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.query.trim().length > 0) count += 1;
    if (filters.city) count += 1;
    if (filters.propertyType !== defaultFilters.propertyType) count += 1;
    if (filters.maxPrice !== defaultFilters.maxPrice) count += 1;
    if (filters.bhk !== defaultFilters.bhk) count += 1;
    if (filters.furnishing !== defaultFilters.furnishing) count += 1;
    if (filters.possession !== defaultFilters.possession) count += 1;
    if (filters.verifiedOnly !== defaultFilters.verifiedOnly) count += 1;
    if (filters.minAiScore !== defaultFilters.minAiScore) count += 1;

    return count;
  }, [filters]);

  const summaryChips = [
    filters.city,
    filters.query.trim().length > 0 ? `Search: ${filters.query.trim()}` : null,
    filters.propertyType !== "all" ? filters.propertyType : null,
    filters.bhk != null ? `${filters.bhk}+ BHK` : null,
    filters.verifiedOnly ? "Verified only" : null,
    filters.minAiScore > 0 ? `AI ${filters.minAiScore}+` : null
  ].filter((value): value is string => Boolean(value));

  const scrollToResults = () => {
    setMobileOpen(false);
    document.getElementById("property-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <GlassCard className="p-4 sm:p-5 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="hero-chip">
            <Sparkles className="h-3.5 w-3.5" />
            Smart filtering
          </p>
          <h3 className="mt-3 text-2xl">Find the right asset faster</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {activeFilterCount === 0
              ? "Start broad, then narrow the market with price, AI score, and inventory quality."
              : `${activeFilterCount} active ${activeFilterCount === 1 ? "filter" : "filters"} shaping your results right now.`}
          </p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 lg:hidden">
        <Button
          variant="secondary"
          className="h-10 px-4"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls="property-filter-controls"
        >
          {mobileOpen ? "Hide filters" : "Show filters"}
          {mobileOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
        {summaryChips.slice(0, 2).map((chip) => (
          <span key={chip} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
            {chip}
          </span>
        ))}
        {summaryChips.length > 2 ? (
          <span className="rounded-full bg-white/60 px-3 py-2 text-xs font-medium text-muted-foreground dark:bg-slate-800/50">
            +{summaryChips.length - 2} more
          </span>
        ) : null}
      </div>

      <div id="property-filter-controls" className={`mt-6 space-y-5 ${mobileOpen ? "block" : "hidden"} lg:block`}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Search</span>
          <input
            value={filters.query}
            onChange={(event) => updateFilters({ query: event.target.value })}
            placeholder="Search locality, builder, or city"
            className="h-11 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>

        <SelectField
          label="City"
          value={filters.city ?? "all"}
          onChange={(value) => updateFilters({ city: value === "all" ? null : value })}
          options={[{ label: "All cities", value: "all" }, ...cities.map((city) => ({ label: city, value: city }))]}
        />

        <SelectField
          label="Property type"
          value={filters.propertyType}
          onChange={(value) => updateFilters({ propertyType: value as PropertyFilters["propertyType"] })}
          options={[
            { label: "All property types", value: "all" },
            { label: "Apartment", value: "apartment" },
            { label: "Villa", value: "villa" },
            { label: "Plot", value: "plot" },
            { label: "Commercial", value: "commercial" }
          ]}
        />

        <SelectField
          label="Furnishing"
          value={filters.furnishing}
          onChange={(value) => updateFilters({ furnishing: value as PropertyFilters["furnishing"] })}
          options={[
            { label: "All furnishing", value: "all" },
            { label: "Unfurnished", value: "unfurnished" },
            { label: "Semi-furnished", value: "semi-furnished" },
            { label: "Fully furnished", value: "fully furnished" }
          ]}
        />

        <SelectField
          label="Possession"
          value={filters.possession}
          onChange={(value) => updateFilters({ possession: value as PropertyFilters["possession"] })}
          options={[
            { label: "All possession", value: "all" },
            { label: "Ready", value: "ready" },
            { label: "Under construction", value: "under construction" },
            { label: "New launch", value: "new launch" }
          ]}
        />

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Max price</span>
            <span className="text-primary">{formatCompactCurrency(filters.maxPrice)}</span>
          </div>
          <input
            type="range"
            min={5000000}
            max={60000000}
            step={500000}
            value={filters.maxPrice}
            onChange={(event) => updateFilters({ maxPrice: Number(event.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Minimum AI score</span>
            <span className="text-primary">{filters.minAiScore}</span>
          </div>
          <input
            type="range"
            min={0}
            max={95}
            step={1}
            value={filters.minAiScore}
            onChange={(event) => updateFilters({ minAiScore: Number(event.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>BHK minimum</span>
            <span className="text-primary">{filters.bhk ?? "Any"}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={filters.bhk ?? 0}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              updateFilters({ bhk: nextValue === 0 ? null : nextValue });
            }}
            className="w-full accent-primary"
          />
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-slate-800/45">
          <div>
            <p className="text-sm font-medium">Verified only</p>
            <p className="text-xs text-muted-foreground">Show trusted and reviewed inventory</p>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(event) => updateFilters({ verifiedOnly: event.target.checked })}
            className="h-5 w-5 rounded accent-primary"
          />
        </label>
      </div>

      <div className={`mt-6 flex flex-col gap-3 sm:flex-row ${mobileOpen ? "flex" : "hidden"} lg:flex`}>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            resetFilters();
            setMobileOpen(false);
          }}
        >
          Reset
        </Button>
        <Button className="flex-1" onClick={scrollToResults}>
          View results
        </Button>
      </div>
    </GlassCard>
  );
}
