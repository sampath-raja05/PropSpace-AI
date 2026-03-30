import { appConfig } from "@/lib/constants";
import { calculateEmi } from "@/lib/emi";
import { resolvePropertyImagesById } from "@/lib/property-seeds";
import { getServerApiBaseUrls, joinApiUrl } from "@/lib/api-targets";
import {
  alertRules,
  cityAllocationSeries,
  dashboardMetrics,
  featuredProperties,
  getPropertyBySlug,
  marketMomentumSeries,
  portfolioHoldings,
  properties,
  propertyTypeSeries
} from "@/lib/properties";
import type {
  AlertRule,
  DashboardChartSeries,
  EmiCalculation,
  EmiCalculationInput,
  PortfolioHolding,
  Property,
  PropertyMetrics
} from "@/types";

interface FetchFallbackOptions {
  cache?: RequestCache;
  revalidate?: number | false;
}

async function fetchFromApi(path: string, init?: RequestInit & { next?: { revalidate?: number } }) {
  if (typeof window !== "undefined") {
    return fetch(joinApiUrl(appConfig.apiBaseUrl, path), init);
  }

  let lastError: unknown = null;

  for (const baseUrl of getServerApiBaseUrls()) {
    try {
      return await fetch(joinApiUrl(baseUrl, path), init);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to reach any configured API endpoint");
}

function normalizeProperty(raw: unknown): Property {
  const property = raw as Record<string, unknown>;
  const id = String(property.id);
  const rawImages = ((property.images as string[]) ?? []) as string[];

  return {
    id,
    slug: String(property.slug),
    title: String(property.title),
    city: String(property.city),
    tier: Number(property.tier) as Property["tier"],
    locality: String(property.locality),
    state: String(property.state),
    latitude: Number(property.latitude),
    longitude: Number(property.longitude),
    address: String(property.address),
    price: Number(property.price),
    bhk: Number(property.bhk),
    baths: Number(property.baths),
    sqft: Number(property.sqft),
    propertyType: String(property.propertyType ?? property.property_type) as Property["propertyType"],
    furnishing: String(property.furnishing) as Property["furnishing"],
    possession: String(property.possession) as Property["possession"],
    verified: Boolean(property.verified),
    aiInvestmentScore: Number(property.aiInvestmentScore ?? property.ai_investment_score),
    builderName: String(property.builderName ?? property.builder_name),
    launchYear: Number(property.launchYear ?? property.launch_year),
    possessionDateLabel: String(property.possessionDateLabel ?? property.possession_date_label),
    pricePerSqft: Number(property.pricePerSqft ?? property.price_per_sqft),
    annualAppreciation: Number(property.annualAppreciation ?? property.annual_appreciation),
    rentalYield: Number(property.rentalYield ?? property.rental_yield),
    overpricingPercent: Number(property.overpricingPercent ?? property.overpricing_percent),
    predictedPrice: Number(property.predictedPrice ?? property.predicted_price),
    predictedPriceLow: Number(property.predictedPriceLow ?? property.predicted_price_low),
    predictedPriceHigh: Number(property.predictedPriceHigh ?? property.predicted_price_high),
    amenities: ((property.amenities as Property["amenities"]) ?? []) as Property["amenities"],
    images: resolvePropertyImagesById(id, rawImages),
    heroTag: String(property.heroTag ?? property.hero_tag),
    description: String(property.description),
    highlights: ((property.highlights as string[]) ?? []) as string[],
    priceHistory: (((property.priceHistory ?? property.price_history) as Array<Record<string, unknown>>) ?? []).map(
      (point) => ({
        month: String(point.month),
        price: Number(point.price)
      })
    ),
    comparables: (((property.comparables as Array<Record<string, unknown>>) ?? []) as Array<Record<string, unknown>>).map(
      (item) => ({
        name: String(item.name),
        distanceKm: Number(item.distanceKm ?? item.distance_km),
        price: Number(item.price),
        sqft: Number(item.sqft)
      })
    ),
    neighborhoodScores: (
      ((property.neighborhoodScores ?? property.neighborhood_scores) as Array<Record<string, unknown>>) ?? []
    ).map((item) => ({
      label: String(item.label),
      score: Number(item.score)
    }))
  };
}

function normalizeMetrics(raw: unknown): PropertyMetrics {
  const metrics = raw as Record<string, unknown>;

  return {
    totalPortfolioValue: Number(metrics.totalPortfolioValue ?? metrics.total_portfolio_value),
    averageYield: Number(metrics.averageYield ?? metrics.average_yield),
    watchlistGrowth: Number(metrics.watchlistGrowth ?? metrics.watchlist_growth),
    activeAlerts: Number(metrics.activeAlerts ?? metrics.active_alerts)
  };
}

function normalizeHolding(raw: unknown): PortfolioHolding {
  const holding = raw as Record<string, unknown>;

  return {
    id: String(holding.id),
    propertyId: String(holding.propertyId ?? holding.property_id),
    acquisitionValue: Number(holding.acquisitionValue ?? holding.acquisition_value),
    currentValue: Number(holding.currentValue ?? holding.current_value),
    targetYield: Number(holding.targetYield ?? holding.target_yield),
    notes: String(holding.notes ?? "")
  };
}

function normalizeAlert(raw: unknown): AlertRule {
  const alert = raw as Record<string, unknown>;

  return {
    id: String(alert.id),
    title: String(alert.title),
    city: String(alert.city),
    trigger: String(alert.trigger),
    status: String(alert.status) as AlertRule["status"],
    createdAt: String(alert.createdAt ?? alert.created_at)
  };
}

function normalizeChartSeries(raw: unknown): DashboardChartSeries {
  const item = raw as Record<string, unknown>;

  return {
    name: String(item.name),
    value: Number(item.value)
  };
}

function normalizeEmi(raw: unknown): EmiCalculation {
  const emi = raw as Record<string, unknown>;

  return {
    propertyId: String(emi.propertyId ?? emi.property_id ?? ""),
    propertyPrice: Number(emi.propertyPrice ?? emi.property_price),
    downPayment: Number(emi.downPayment ?? emi.down_payment),
    downPaymentRatio: Number(emi.downPaymentRatio ?? emi.down_payment_ratio),
    loanAmount: Number(emi.loanAmount ?? emi.loan_amount),
    annualInterestRate: Number(emi.annualInterestRate ?? emi.annual_interest_rate),
    tenureYears: Number(emi.tenureYears ?? emi.tenure_years),
    tenureMonths: Number(emi.tenureMonths ?? emi.tenure_months),
    monthlyEmi: Number(emi.monthlyEmi ?? emi.monthly_emi),
    totalInterest: Number(emi.totalInterest ?? emi.total_interest),
    totalLoanRepayment: Number(emi.totalLoanRepayment ?? emi.total_loan_repayment),
    totalPayment: Number(emi.totalPayment ?? emi.total_payment),
    recommendedMonthlyIncome: Number(emi.recommendedMonthlyIncome ?? emi.recommended_monthly_income),
    interestShare: Number(emi.interestShare ?? emi.interest_share),
    source: "api"
  };
}

async function fetchWithFallback<T>(
  path: string,
  fallback: T,
  normalize?: (raw: unknown) => T,
  options: FetchFallbackOptions = {}
): Promise<T> {
  try {
    const requestInit: RequestInit & { next?: { revalidate?: number } } = {};

    if (options.revalidate !== false) {
      requestInit.next = {
        revalidate: options.revalidate ?? 300
      };
    } else {
      requestInit.cache = "no-store";
    }

    if (options.cache) {
      requestInit.cache = options.cache;
    }

    const response = await fetchFromApi(path, requestInit);

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as unknown;
    return normalize ? normalize(data) : (data as T);
  } catch {
    return fallback;
  }
}

export async function getAllProperties() {
  return fetchWithFallback("/properties", properties, (raw) => (raw as unknown[]).map(normalizeProperty));
}

export async function getFeaturedProperties() {
  return fetchWithFallback("/properties/featured", featuredProperties, (raw) => (raw as unknown[]).map(normalizeProperty));
}

export async function getProperty(slug: string) {
  return fetchWithFallback(`/properties/${slug}`, getPropertyBySlug(slug) ?? null, (raw) =>
    raw ? normalizeProperty(raw) : null
  );
}

export async function getDashboardMetrics() {
  return fetchWithFallback("/dashboard/overview", dashboardMetrics, normalizeMetrics);
}

export async function getMarketMomentumSeries() {
  return fetchWithFallback("/dashboard/market-momentum", marketMomentumSeries, (raw) =>
    (raw as unknown[]).map(normalizeChartSeries)
  );
}

export async function getCityAllocationSeries() {
  return fetchWithFallback("/dashboard/city-allocation", cityAllocationSeries, (raw) =>
    (raw as unknown[]).map(normalizeChartSeries)
  );
}

export async function getPropertyMixSeries() {
  return fetchWithFallback("/dashboard/property-mix", propertyTypeSeries, (raw) =>
    (raw as unknown[]).map(normalizeChartSeries)
  );
}

export async function getPortfolio() {
  return fetchWithFallback("/portfolio", portfolioHoldings, (raw) => (raw as unknown[]).map(normalizeHolding));
}

export async function getAlerts() {
  return fetchWithFallback("/alerts", alertRules, (raw) => (raw as unknown[]).map(normalizeAlert));
}

export async function getEmiCalculation(propertyId: string, input: EmiCalculationInput) {
  const fallback = {
    ...calculateEmi(input),
    propertyId
  } satisfies EmiCalculation;
  const searchParams = new URLSearchParams({
    down_payment: String(input.downPayment),
    annual_interest_rate: String(input.annualInterestRate),
    tenure_years: String(input.tenureYears)
  });

  return fetchWithFallback(`/properties/${propertyId}/emi?${searchParams.toString()}`, fallback, normalizeEmi, {
    revalidate: false
  });
}
