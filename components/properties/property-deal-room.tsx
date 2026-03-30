"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeIndianRupee,
  Compass,
  LineChart,
  MapPinned,
  Sparkles,
  Waves
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { cn, formatCompactCurrency, formatCurrency, formatPercent, formatScore } from "@/lib/utils";
import type { Property } from "@/types";

const dealLenses = [
  { id: "value", label: "Value lens", icon: BadgeIndianRupee },
  { id: "income", label: "Income lens", icon: LineChart },
  { id: "locality", label: "Locality lens", icon: Compass }
] as const;

type DealLensId = (typeof dealLenses)[number]["id"];

function InsightMetric({
  label,
  value,
  helper,
  accent = "text-primary"
}: {
  label: string;
  value: string;
  helper: string;
  accent?: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/60 p-4 dark:bg-slate-800/50">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={cn("mt-3 text-2xl font-semibold tracking-tight", accent)}>{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

function SignalBar({
  label,
  value,
  maxValue,
  helper,
  accentClassName = "bg-primary"
}: {
  label: string;
  value: number;
  maxValue: number;
  helper: string;
  accentClassName?: string;
}) {
  const width = maxValue <= 0 ? 0 : Math.max((value / maxValue) * 100, 8);

  return (
    <div className="rounded-[22px] bg-white/55 p-4 dark:bg-slate-800/45">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm font-semibold">{helper}</p>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-muted/70">
        <div className={cn("h-full rounded-full transition-all duration-500", accentClassName)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function PropertyDealRoom({ property }: { property: Property }) {
  const [activeLens, setActiveLens] = useState<DealLensId>("value");

  const fairMidpoint = Math.round((property.predictedPriceLow + property.predictedPriceHigh) / 2);
  const comparableAveragePrice =
    property.comparables.length > 0
      ? Math.round(property.comparables.reduce((total, comparable) => total + comparable.price, 0) / property.comparables.length)
      : property.price;
  const comparableAverageSqft =
    property.comparables.length > 0
      ? Math.round(property.comparables.reduce((total, comparable) => total + comparable.sqft, 0) / property.comparables.length)
      : property.sqft;
  const estimatedMonthlyRent = Math.round((property.price * (property.rentalYield / 100)) / 12);
  const strongestSignal = [...property.neighborhoodScores].sort((left, right) => right.score - left.score)[0];
  const weakestSignal = [...property.neighborhoodScores].sort((left, right) => left.score - right.score)[0];
  const valueGap = ((fairMidpoint - property.price) / property.price) * 100;

  const activeLensCopy =
    activeLens === "value"
      ? "See how the ask stacks up against AI fair value and local comparables in one glance."
      : activeLens === "income"
        ? "Switch to yield mode to gauge cash-flow friendliness, income comfort, and appreciation potential."
        : "Read the strongest and weakest neighborhood signals before making the site visit.";

  return (
    <GlassCard className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-primary/12 via-transparent to-accent/12" />
      <div className="pointer-events-none absolute -right-12 top-12 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="hero-chip">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive deal room
          </p>
          <h2 className="mt-4 text-2xl sm:text-4xl">Turn the blank space into decision support</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{activeLensCopy}</p>
        </div>
        <Link
          href={`/map?property=${property.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
        >
          <MapPinned className="h-4 w-4" />
          Open live map
        </Link>
      </div>

      <div className="relative mt-6 grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {dealLenses.map((lens) => (
          <button
            key={lens.id}
            type="button"
            onClick={() => setActiveLens(lens.id)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300",
              activeLens === lens.id
                ? "border-primary/40 bg-primary text-primary-foreground shadow-glass"
                : "border-white/10 bg-white/55 text-foreground hover:border-primary/25 hover:bg-white/75 dark:bg-slate-900/45 dark:hover:bg-slate-900/65"
            )}
          >
            <lens.icon className="h-4 w-4" />
            {lens.label}
          </button>
        ))}
      </div>

      {activeLens === "value" ? (
        <div className="relative mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <InsightMetric
              label="Current ask"
              value={formatCompactCurrency(property.price)}
              helper={`${formatCurrency(property.pricePerSqft)} per sqft in ${property.locality}`}
            />
            <InsightMetric
              label="AI fair midpoint"
              value={formatCompactCurrency(fairMidpoint)}
              helper={`Range ${formatCompactCurrency(property.predictedPriceLow)} to ${formatCompactCurrency(property.predictedPriceHigh)}`}
              accent={valueGap >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}
            />
            <InsightMetric
              label="Comparable average"
              value={formatCompactCurrency(comparableAveragePrice)}
              helper={`${comparableAverageSqft.toLocaleString("en-IN")} sqft average nearby`}
              accent="text-teal-600 dark:text-teal-300"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3 rounded-[28px] border border-white/10 bg-primary/5 p-5">
              <SignalBar
                label="Subject property ask"
                value={property.price}
                maxValue={Math.max(property.price, fairMidpoint, comparableAveragePrice)}
                helper={formatCompactCurrency(property.price)}
              />
              <SignalBar
                label="AI fair value"
                value={fairMidpoint}
                maxValue={Math.max(property.price, fairMidpoint, comparableAveragePrice)}
                helper={formatCompactCurrency(fairMidpoint)}
                accentClassName="bg-emerald-500"
              />
              <SignalBar
                label="Nearby comparable average"
                value={comparableAveragePrice}
                maxValue={Math.max(property.price, fairMidpoint, comparableAveragePrice)}
                helper={formatCompactCurrency(comparableAveragePrice)}
                accentClassName="bg-teal-500"
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/55 p-5 dark:bg-slate-800/45">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Positioning callout</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                {valueGap >= 0 ? `${formatPercent(valueGap)} below fair value` : `${formatPercent(Math.abs(valueGap))} above fair value`}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {property.overpricingPercent > 6
                  ? "This listing is carrying a clear premium. Great if the finish quality is exceptional, but it needs stronger negotiation discipline."
                  : "This listing sits in a more workable zone. You have room to validate the micro-market instead of walking into an obvious premium ask."}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {activeLens === "income" ? (
        <div className="relative mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <InsightMetric
              label="Rental yield"
              value={`${property.rentalYield.toFixed(1)}%`}
              helper="Indicative annual gross yield"
              accent="text-emerald-600 dark:text-emerald-300"
            />
            <InsightMetric
              label="Projected appreciation"
              value={`${property.annualAppreciation.toFixed(1)}%`}
              helper="Expected annual capital growth signal"
              accent="text-primary"
            />
            <InsightMetric
              label="Estimated monthly rent"
              value={formatCompactCurrency(estimatedMonthlyRent)}
              helper="Yield translated into a rough monthly cash-flow reference"
              accent="text-teal-600 dark:text-teal-300"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/55 p-5 dark:bg-slate-800/45">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Income fit</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">AI score</p>
                  <p className="mt-2 text-2xl font-semibold">{formatScore(property.aiInvestmentScore)}/100</p>
                </div>
                <div className="rounded-[22px] bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Price momentum</p>
                  <p className="mt-2 text-2xl font-semibold">{formatPercent(property.annualAppreciation)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Higher-yield assets help cash flow faster. Higher-appreciation assets reward patience. This listing leans{" "}
                <span className="font-medium text-foreground">
                  {property.rentalYield >= 3.3 ? "toward income strength" : property.annualAppreciation >= 7.4 ? "toward appreciation strength" : "toward balanced hold quality"}
                </span>
                .
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-primary/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Capital posture</p>
              <div className="mt-4 space-y-3">
                <SignalBar
                  label="Yield confidence"
                  value={property.rentalYield}
                  maxValue={6.5}
                  helper={`${property.rentalYield.toFixed(1)}%`}
                  accentClassName="bg-emerald-500"
                />
                <SignalBar
                  label="Growth momentum"
                  value={property.annualAppreciation}
                  maxValue={11}
                  helper={`${property.annualAppreciation.toFixed(1)}%`}
                  accentClassName="bg-primary"
                />
                <SignalBar
                  label="Entry comfort"
                  value={Math.max(0, 20 - Math.max(property.overpricingPercent, 0))}
                  maxValue={20}
                  helper={property.overpricingPercent <= 0 ? "Good entry" : formatPercent(property.overpricingPercent)}
                  accentClassName="bg-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {activeLens === "locality" ? (
        <div className="relative mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <InsightMetric
              label="Strongest signal"
              value={strongestSignal.label}
              helper={`${strongestSignal.score}% neighborhood confidence`}
              accent="text-emerald-600 dark:text-emerald-300"
            />
            <InsightMetric
              label="Watch closely"
              value={weakestSignal.label}
              helper={`${weakestSignal.score}% vs stronger local factors`}
              accent="text-amber-600 dark:text-amber-300"
            />
            <InsightMetric
              label="Locality pulse"
              value={`${Math.round(property.neighborhoodScores.reduce((total, item) => total + item.score, 0) / property.neighborhoodScores.length)}%`}
              helper="Blended livability and access reading"
              accent="text-primary"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/55 p-5 dark:bg-slate-800/45">
              <div className="space-y-3">
                {property.neighborhoodScores
                  .slice()
                  .sort((left, right) => right.score - left.score)
                  .map((item) => (
                    <SignalBar
                      key={item.label}
                      label={item.label}
                      value={item.score}
                      maxValue={100}
                      helper={`${item.score}%`}
                      accentClassName={item.score >= 80 ? "bg-emerald-500" : item.score >= 70 ? "bg-primary" : "bg-amber-500"}
                    />
                  ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-primary/5 p-5">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Waves className="h-4 w-4" />
                Street-level read
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                The neighborhood story here is strongest around{" "}
                <span className="font-medium text-foreground">{strongestSignal.label.toLowerCase()}</span>, while{" "}
                <span className="font-medium text-foreground">{weakestSignal.label.toLowerCase()}</span> is the factor most worth validating in person.
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Use this lens before site visits: it gives you a sharper checklist than just looking at glossy amenities.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mt-6 rounded-[28px] border border-white/10 bg-white/55 p-5 dark:bg-slate-800/45">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Nearby anchors</p>
            <h3 className="mt-3 text-2xl">Comparable assets around this listing</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tap the map after this to inspect how these nearby assets cluster around the property.
            </p>
          </div>
          <Link href={`/map?property=${property.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            View neighborhood context
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {property.comparables.length > 0 ? (
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {property.comparables.map((comparable) => {
              const priceDelta = ((property.price - comparable.price) / comparable.price) * 100;
              const relativeLabel =
                priceDelta > 0 ? `${formatPercent(priceDelta)} richer ask` : priceDelta < 0 ? `${formatPercent(Math.abs(priceDelta))} below subject` : "On par";

              return (
                <div key={comparable.name} className="rounded-[22px] bg-background/70 p-4">
                  <p className="text-lg font-semibold">{comparable.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{comparable.distanceKm} km away</p>
                  <p className="mt-4 text-xl font-semibold">{formatCompactCurrency(comparable.price)}</p>
                  <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <span>{comparable.sqft.toLocaleString("en-IN")} sqft</span>
                    <span
                      className={cn(
                        "font-medium",
                        priceDelta > 0 && "text-rose-600 dark:text-rose-300",
                        priceDelta < 0 && "text-emerald-600 dark:text-emerald-300",
                        priceDelta === 0 && "text-primary"
                      )}
                    >
                      {relativeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-[22px] bg-background/70 p-5 text-sm leading-7 text-muted-foreground">
            This listing does not yet have enough same-city comparables to build a confident side-by-side set. Use the live map to inspect the surrounding market manually.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
