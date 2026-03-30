import { format, subMonths } from "date-fns";

import { propertySeeds } from "@/lib/property-seeds";
import { slugify } from "@/lib/utils";
import type {
  AlertRule,
  ComparableProperty,
  DashboardChartSeries,
  NeighborhoodScore,
  PortfolioHolding,
  PriceHistoryPoint,
  Property,
  PropertyMetrics,
  PropertySeed
} from "@/types";

const cityBenchmarks: Record<string, number> = {
  Mumbai: 22000,
  Bangalore: 11800,
  Delhi: 13250,
  Hyderabad: 9600,
  Chennai: 8900,
  Coimbatore: 6100,
  Kochi: 7600,
  Jaipur: 6400,
  Lucknow: 5900,
  Chandigarh: 10800,
  Salem: 4900,
  Madurai: 5200,
  Mysore: 5800,
  Nagpur: 5400,
  Indore: 6100
};

const cityGrowth: Record<string, number> = {
  Mumbai: 7.2,
  Bangalore: 8.4,
  Delhi: 6.6,
  Hyderabad: 8.1,
  Chennai: 7.1,
  Coimbatore: 6.3,
  Kochi: 6.8,
  Jaipur: 6.4,
  Lucknow: 6.7,
  Chandigarh: 7.0,
  Salem: 5.6,
  Madurai: 5.9,
  Mysore: 6.1,
  Nagpur: 6.0,
  Indore: 6.9
};

const cityRentalYield: Record<string, number> = {
  Mumbai: 2.8,
  Bangalore: 3.6,
  Delhi: 3.2,
  Hyderabad: 3.5,
  Chennai: 3.1,
  Coimbatore: 3.0,
  Kochi: 3.2,
  Jaipur: 2.9,
  Lucknow: 3.0,
  Chandigarh: 3.1,
  Salem: 2.8,
  Madurai: 2.9,
  Mysore: 3.0,
  Nagpur: 3.1,
  Indore: 3.3
};

const propertyTypeFactor: Record<Property["propertyType"], number> = {
  apartment: 1,
  villa: 1.16,
  plot: 0.78,
  commercial: 1.1
};

const furnishingFactor: Record<Property["furnishing"], number> = {
  unfurnished: 0.94,
  "semi-furnished": 1,
  "fully furnished": 1.08
};

const possessionFactor: Record<Property["possession"], number> = {
  ready: 1.05,
  "under construction": 0.99,
  "new launch": 0.95
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeSignal(value: number, min: number, max: number) {
  if (max === min) {
    return 0;
  }

  return clamp((value - min) / (max - min), 0, 1);
}

function roundMetric(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function getScoreFingerprint(seed: PropertySeed | string) {
  const source =
    typeof seed === "string"
      ? seed
      : `${seed.id}:${seed.city}:${seed.locality}:${seed.builderName}:${seed.launchYear}:${seed.bhk}:${seed.price}`;

  return source.split("").reduce((total, character, index) => total + character.charCodeAt(0) * (index + 1), 0);
}

function getNeighborhoodDrift(seed: PropertySeed, label: string, spread: number) {
  const fingerprint = getScoreFingerprint(`${seed.id}:${seed.locality}:${label}`);
  return (fingerprint % (spread * 2 + 1)) - spread;
}

function ensureDistinctAiScores<T extends { id: string; aiInvestmentScore: number }>(items: T[]) {
  const assignedScores = new Map<string, number>();
  const usedScores = new Set<number>();

  items
    .slice()
    .sort((left, right) => right.aiInvestmentScore - left.aiInvestmentScore || left.id.localeCompare(right.id))
    .forEach((item) => {
      let nextScore = item.aiInvestmentScore;

      while (usedScores.has(nextScore)) {
        nextScore = roundMetric(Math.max(nextScore - 0.1, 58));
      }

      usedScores.add(nextScore);
      assignedScores.set(item.id, nextScore);
    });

  return items.map((item) => ({
    ...item,
    aiInvestmentScore: assignedScores.get(item.id) ?? item.aiInvestmentScore
  }));
}

function ensureDistinctNeighborhoodScores(scores: NeighborhoodScore[]) {
  const usedScores = new Set<number>();

  return scores.map((item) => {
    let nextScore = item.score;
    let step = 1;

    while (usedScores.has(nextScore)) {
      const higherScore = clamp(item.score + step, 52, 96);
      const lowerScore = clamp(item.score - step, 52, 96);

      if (!usedScores.has(higherScore)) {
        nextScore = higherScore;
        break;
      }

      if (!usedScores.has(lowerScore)) {
        nextScore = lowerScore;
        break;
      }

      step += 1;
    }

    usedScores.add(nextScore);
    return {
      ...item,
      score: nextScore
    };
  });
}

function buildPredictedRange(predictedPrice: number, seed: PropertySeed) {
  const confidenceBand = clamp(
    0.05 +
      (seed.possession !== "ready" ? 0.015 : 0) +
      (seed.propertyType === "plot" ? 0.02 : seed.propertyType === "commercial" ? 0.012 : seed.propertyType === "villa" ? 0.008 : 0) +
      (seed.tier === 3 ? 0.01 : seed.tier === 2 ? 0.006 : 0.004),
    0.05,
    0.11
  );

  return {
    low: Math.round(predictedPrice * (1 - confidenceBand)),
    high: Math.round(predictedPrice * (1 + confidenceBand))
  };
}

function buildPriceHistory(seed: PropertySeed, annualAppreciation: number): PriceHistoryPoint[] {
  const monthlyRate = annualAppreciation / 100 / 12;

  return Array.from({ length: 8 }, (_, index) => {
    const monthsAgo = 7 - index;
    const month = subMonths(new Date(), monthsAgo);
    const price = Math.round(seed.price / Math.pow(1 + monthlyRate, monthsAgo) * (1 + Math.sin(index) * 0.01));

    return {
      month: format(month, "MMM yy"),
      price
    };
  });
}

function buildNeighborhoodScores(seed: PropertySeed, aiScore: number): NeighborhoodScore[] {
  const amenityBoost = seed.amenities.length * 0.9;
  const tierBase = seed.tier === 1 ? 75 : seed.tier === 2 ? 69 : 63;
  const commercialBoost = seed.propertyType === "commercial" ? 5 : 0;
  const familyBoost = seed.propertyType === "villa" ? 5 : seed.bhk >= 3 ? 4 : seed.propertyType === "plot" ? -2 : 1;
  const quietBoost = seed.propertyType === "villa" ? 4 : seed.propertyType === "plot" ? 5 : 0;
  const greeneryBoost = seed.amenities.includes("garden") ? 3 : seed.amenities.includes("pool") ? 1 : 0;
  const verifiedBoost = seed.verified ? 3 : 0;
  const densityPenalty = seed.tier === 1 ? 5 : seed.tier === 2 ? 3 : 1;
  const metroBoost = cityGrowth[seed.city] >= 7.5 ? 2 : 0;
  const readinessBoost = seed.possession === "ready" ? 2 : 0;
  const localityMomentum = ((getScoreFingerprint(`${seed.locality}:${seed.launchYear}`) % 7) - 3) * 0.6;
  const lifestyleBoost = seed.amenities.includes("terrace") ? 2 : seed.amenities.includes("coworking") ? 1 : 0;
  const familyInfraBoost = seed.amenities.includes("play-area") ? 2 : seed.bhk >= 3 ? 1 : 0;

  return ensureDistinctNeighborhoodScores([
    {
      label: "Connectivity",
      score: clamp(Math.round(tierBase + amenityBoost + commercialBoost + 6 + metroBoost + localityMomentum + getNeighborhoodDrift(seed, "Connectivity", 5)), 58, 96)
    },
    {
      label: "Safety",
      score: clamp(Math.round(tierBase + verifiedBoost + quietBoost + 5 + lifestyleBoost + getNeighborhoodDrift(seed, "Safety", 4)), 55, 95)
    },
    {
      label: "Schools",
      score: clamp(Math.round(tierBase + familyBoost + familyInfraBoost + 2 + getNeighborhoodDrift(seed, "Schools", 6)), 56, 94)
    },
    {
      label: "Hospitals",
      score: clamp(
        Math.round(
          tierBase +
            verifiedBoost +
            3 +
            (seed.tier === 1 ? 3 : seed.tier === 2 ? 1 : 0) +
            getNeighborhoodDrift(seed, "Hospitals", 4)
        ),
        55,
        95
      )
    },
    {
      label: "Traffic",
      score: clamp(
        Math.round(
          79 -
            densityPenalty -
            commercialBoost +
            (seed.propertyType === "apartment" ? 0 : 2) +
            readinessBoost +
            getNeighborhoodDrift(seed, "Traffic", 5)
        ),
        52,
        90
      )
    },
    {
      label: "AQI",
      score: clamp(
        Math.round(
          78 -
            (seed.tier === 1 ? 8 : seed.tier === 2 ? 4 : 1) +
            greeneryBoost +
            quietBoost +
            getNeighborhoodDrift(seed, "AQI", 6)
        ),
        50,
        92
      )
    },
    {
      label: "Noise",
      score: clamp(
        Math.round(
          76 - densityPenalty - commercialBoost + quietBoost + greeneryBoost + aiScore * 0.02 + getNeighborhoodDrift(seed, "Noise", 6)
        ),
        50,
        92
      )
    }
  ]);
}

function enrichProperty(seed: PropertySeed): Property {
  const benchmark = cityBenchmarks[seed.city] ?? 7000;
  const predictedPrice = Math.round(
    benchmark * seed.sqft * propertyTypeFactor[seed.propertyType] * furnishingFactor[seed.furnishing] * possessionFactor[seed.possession]
  );
  const pricePerSqft = Math.round(seed.price / Math.max(seed.sqft, 1));
  const rawOverpricing = ((seed.price - predictedPrice) / Math.max(predictedPrice, 1)) * 100;
  const overpricingPercent = clamp(rawOverpricing, -18, 22);
  const predictedRange = buildPredictedRange(predictedPrice, seed);
  const annualAppreciation = clamp(
    cityGrowth[seed.city] +
      seed.amenities.length * 0.12 +
      (seed.verified ? 0.4 : 0) +
      (seed.possession === "under construction" ? 0.5 : seed.possession === "new launch" ? 0.7 : 0),
    5.2,
    10.8
  );
  const rentalYield = clamp(
    cityRentalYield[seed.city] +
      (seed.propertyType === "commercial" ? 1.4 : seed.propertyType === "villa" ? -0.3 : seed.propertyType === "plot" ? -1.2 : 0.2) +
      (seed.furnishing === "fully furnished" ? 0.25 : 0),
    1.6,
    6.1
  );
  const appreciationSignal = normalizeSignal(annualAppreciation, 5.2, 10.8);
  const yieldSignal = normalizeSignal(rentalYield, 1.6, 6.1);
  const valueSignal = clamp((22 - overpricingPercent) / 40, 0, 1);
  const amenitySignal = normalizeSignal(seed.amenities.length, 3, 7);
  const benchmarkSignal = clamp(1 - Math.abs(pricePerSqft / Math.max(benchmark, 1) - 1) * 0.75, 0, 1);
  const qualitySignal =
    [
      seed.tier === 1 ? 1 : seed.tier === 2 ? 0.76 : 0.62,
      seed.verified ? 1 : 0.65,
      seed.possession === "ready" ? 0.92 : seed.possession === "under construction" ? 0.82 : 0.78,
      seed.furnishing === "fully furnished" ? 1 : seed.furnishing === "semi-furnished" ? 0.86 : 0.72,
      seed.propertyType === "commercial" ? 0.94 : seed.propertyType === "villa" ? 0.9 : seed.propertyType === "apartment" ? 0.86 : 0.68
    ].reduce((total, signal) => total + signal, 0) / 5;
  const fingerprintAdjustment =
    (((getScoreFingerprint(seed) % 97) / 97) - 0.5) * 1.2 + (((seed.sqft + seed.launchYear) % 11) - 5) * 0.04;
  const aiInvestmentScore = roundMetric(
    clamp(
      48 +
        appreciationSignal * 11 +
        yieldSignal * 10 +
        valueSignal * 13 +
        amenitySignal * 4 +
        qualitySignal * 7 +
        benchmarkSignal * 4 +
        fingerprintAdjustment,
      58,
      95.8
    )
  );

  return {
    ...seed,
    slug: slugify(seed.id),
    aiInvestmentScore,
    pricePerSqft,
    annualAppreciation,
    rentalYield,
    overpricingPercent,
    predictedPrice,
    predictedPriceLow: predictedRange.low,
    predictedPriceHigh: predictedRange.high,
    priceHistory: buildPriceHistory(seed, annualAppreciation),
    comparables: [],
    neighborhoodScores: buildNeighborhoodScores(seed, aiInvestmentScore)
  };
}

const enrichedWithoutComparables = ensureDistinctAiScores(propertySeeds.map(enrichProperty));

function getComparableProperties(property: Property): ComparableProperty[] {
  return enrichedWithoutComparables
    .filter((candidate) => candidate.id !== property.id && candidate.city === property.city)
    .sort((left, right) => {
      const leftScore = Math.abs(left.price - property.price) + Math.abs(left.sqft - property.sqft) * 4000;
      const rightScore = Math.abs(right.price - property.price) + Math.abs(right.sqft - property.sqft) * 4000;
      return leftScore - rightScore;
    })
    .slice(0, 3)
    .map((candidate) => ({
      name: candidate.title,
      distanceKm: Number((Math.abs(candidate.latitude - property.latitude) * 111).toFixed(1)),
      price: candidate.price,
      sqft: candidate.sqft
    }));
}

export const properties: Property[] = enrichedWithoutComparables.map((property) => ({
  ...property,
  comparables: getComparableProperties(property)
}));

export const featuredProperties = [...properties]
  .sort((left, right) => right.aiInvestmentScore - left.aiInvestmentScore)
  .slice(0, 6);

export const cityOptions = Array.from(new Set(properties.map((property) => property.city)));

export const portfolioHoldings: PortfolioHolding[] = [
  { id: "hold-1", propertyId: "mumbai-powai-lakefront-boulevard", acquisitionValue: 22300000, currentValue: 24800000, targetYield: 3.4, notes: "Core long-term hold" },
  { id: "hold-2", propertyId: "bangalore-whitefield-orbit-heights", acquisitionValue: 18100000, currentValue: 19500000, targetYield: 4.2, notes: "Growth corridor position" },
  { id: "hold-3", propertyId: "hyderabad-gachibowli-verde-homes", acquisitionValue: 16500000, currentValue: 17600000, targetYield: 4.0, notes: "Pre-completion upside" },
  { id: "hold-4", propertyId: "coimbatore-rs-puram-lotus-enclave", acquisitionValue: 8100000, currentValue: 8900000, targetYield: 3.2, notes: "Stable yield asset" }
];

export const alertRules: AlertRule[] = [
  { id: "alert-1", title: "Mumbai underpriced opportunities", city: "Mumbai", trigger: "AI score above 85 and overpricing below 2%", status: "active", createdAt: "2026-03-12" },
  { id: "alert-2", title: "Bangalore villa launches", city: "Bangalore", trigger: "New villa inventory above 2500 sqft", status: "active", createdAt: "2026-03-05" },
  { id: "alert-3", title: "Tier 2 yield watchlist", city: "Kochi", trigger: "Rental yield above 3.5%", status: "paused", createdAt: "2026-02-18" }
];

export const dashboardMetrics: PropertyMetrics = {
  totalPortfolioValue: portfolioHoldings.reduce((total, holding) => total + holding.currentValue, 0),
  averageYield:
    Number(
      (
        portfolioHoldings.reduce((total, holding) => {
          const property = properties.find((candidate) => candidate.id === holding.propertyId);
          return total + (property?.rentalYield ?? 0);
        }, 0) / portfolioHoldings.length
      ).toFixed(1)
    ) || 0,
  watchlistGrowth: 14.8,
  activeAlerts: alertRules.filter((alert) => alert.status === "active").length
};

export const marketMomentumSeries: DashboardChartSeries[] = Array.from(
  properties.reduce((cityScores, property) => {
    const scores = cityScores.get(property.city) ?? [];
    scores.push(property.aiInvestmentScore);
    cityScores.set(property.city, scores);
    return cityScores;
  }, new Map<string, number[]>())
)
  .map(([name, scores]) => ({
    name,
    value: Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
  }))
  .sort((left, right) => right.value - left.value)
  .slice(0, 6);

export const cityAllocationSeries: DashboardChartSeries[] = [1, 2, 3].map((tier) => ({
  name: `Tier ${tier}`,
  value: properties.filter((property) => property.tier === tier).length
}));

export const propertyTypeSeries: DashboardChartSeries[] = [
  ["Apartments", "apartment"],
  ["Villas", "villa"],
  ["Plots", "plot"],
  ["Commercial", "commercial"]
].map(([name, propertyType]) => ({
  name,
  value: properties.filter((property) => property.propertyType === propertyType).length
}));

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug || property.id === slug);
}

export function getPropertiesByIds(ids: string[]) {
  return properties.filter((property) => ids.includes(property.id));
}
