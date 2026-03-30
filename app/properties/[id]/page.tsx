import Link from "next/link";
import { Download, MapPinned, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { AIInsightCard } from "@/components/insights/ai-insight-card";
import { NeighborhoodScoreChart } from "@/components/insights/neighborhood-score-chart";
import { PriceHistoryChart } from "@/components/insights/price-history-chart";
import { PageShell } from "@/components/layout/page-shell";
import { PropertyDealRoom } from "@/components/properties/property-deal-room";
import { EmiCalculator } from "@/components/properties/emi-calculator";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { GlassCard } from "@/components/ui/glass-card";
import { appConfig } from "@/lib/constants";
import { getProperty } from "@/lib/api";
import { formatCompactCurrency, formatCurrency, formatPercent, formatScore } from "@/lib/utils";

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  const predictedMidpoint = (property.predictedPriceLow + property.predictedPriceHigh) / 2;
  const fairRangeDelta = ((predictedMidpoint - property.price) / property.price) * 100;
  const fairRangeTone =
    property.price > property.predictedPriceHigh ? "negative" : property.price < property.predictedPriceLow ? "positive" : "neutral";

  return (
    <PageShell className="space-y-6 sm:space-y-8">
      <GlassCard className="p-5 sm:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="hero-chip">{property.heroTag}</p>
            <h1 className="mt-4 text-3xl sm:text-5xl">{property.title}</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
              {property.address} | {property.propertyType} |{" "}
              {property.bhk > 0 ? `${property.bhk} BHK` : "Flexible configuration"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {formatCompactCurrency(property.price)}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
              AI score {formatScore(property.aiInvestmentScore)}/100
            </span>
            {property.verified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-sm font-medium dark:bg-slate-800/45">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verified
              </span>
            ) : null}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <PropertyGallery images={property.images} title={property.title} />

        <div className="space-y-4">
          <AIInsightCard
            title="Predicted fair price range"
            value={`${formatCompactCurrency(property.predictedPriceLow)} - ${formatCompactCurrency(property.predictedPriceHigh)}`}
            delta={fairRangeDelta}
            tone={fairRangeTone}
            description="This band captures our expected fair-value zone after adjusting for city benchmarks, asset type, furnishing, and project maturity."
          />
          <AIInsightCard
            title="Overpricing signal"
            value={formatPercent(property.overpricingPercent)}
            delta={property.overpricingPercent}
            tone={property.overpricingPercent <= 3 ? "positive" : "negative"}
            description="Positive means the current ask sits above our modeled fair-value band."
          />
          <AIInsightCard
            title="Rental yield"
            value={`${property.rentalYield.toFixed(1)}%`}
            delta={property.rentalYield - 3}
            tone={property.rentalYield >= 3.2 ? "positive" : "neutral"}
            description="Indicative annual gross yield based on local demand, asset type, and furnishing depth."
          />
          <GlassCard className="p-5">
            <h2 className="text-2xl">Report export</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Download a PDF summary covering pricing, comparables, AI commentary, and neighborhood intelligence.
            </p>
            <a
              href={`${appConfig.apiBaseUrl}/reports/${property.id}/pdf`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download PDF report
            </a>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PriceHistoryChart data={property.priceHistory} />
        <NeighborhoodScoreChart data={property.neighborhoodScores} />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <EmiCalculator propertyId={property.id} propertyPrice={property.price} propertyTitle={property.title} />

          <GlassCard className="p-6">
            <h2 className="text-3xl">Property essentials</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-muted-foreground">Price per sqft</dt>
                <dd className="font-semibold">{formatCurrency(property.pricePerSqft)}</dd>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-muted-foreground">Possession</dt>
                <dd className="font-semibold">{property.possessionDateLabel}</dd>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-muted-foreground">Builder</dt>
                <dd className="font-semibold">{property.builderName}</dd>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-muted-foreground">Projected appreciation</dt>
                <dd className="font-semibold">{property.annualAppreciation.toFixed(1)}%</dd>
              </div>
            </dl>

            <div className="mt-8">
              <h3 className="text-xl">Amenities</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-white/60 px-3 py-2 text-sm capitalize dark:bg-slate-800/50">
                    {amenity.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl">Highlights</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {property.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <PropertyDealRoom property={property} />

          <GlassCard className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="hero-chip">Decision note</p>
                <h2 className="mt-4 text-3xl">AI commentary</h2>
              </div>
              <Link href={`/map?property=${property.slug}`} className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary">
                <MapPinned className="h-4 w-4" />
                View on map
              </Link>
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {property.overpricingPercent > 6
                ? "This asset carries a premium ask versus modeled fair value, but the gap is partially offset by strong locality quality and verified project credentials."
                : "This asset sits close to or below our fair-value band, supported by a healthy balance of livability, access, and long-term demand fundamentals."}
            </p>
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
}
