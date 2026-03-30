import type { GeoJsonObject } from "geojson";

import type { furnishingTypes, possessionStatuses, propertyTypes, userRoles } from "@/lib/constants";

export type PropertyType = (typeof propertyTypes)[number];
export type FurnishingType = (typeof furnishingTypes)[number];
export type PossessionStatus = (typeof possessionStatuses)[number];
export type UserRole = (typeof userRoles)[number];

export type PropertyAmenity =
  | "clubhouse"
  | "pool"
  | "gym"
  | "security"
  | "parking"
  | "garden"
  | "coworking"
  | "play-area"
  | "ev-charging"
  | "terrace";

export interface PriceHistoryPoint {
  month: string;
  price: number;
}

export interface ComparableProperty {
  name: string;
  distanceKm: number;
  price: number;
  sqft: number;
}

export interface NeighborhoodScore {
  label: string;
  score: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  city: string;
  tier: 1 | 2 | 3;
  locality: string;
  state: string;
  latitude: number;
  longitude: number;
  address: string;
  price: number;
  bhk: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  furnishing: FurnishingType;
  possession: PossessionStatus;
  verified: boolean;
  aiInvestmentScore: number;
  builderName: string;
  launchYear: number;
  possessionDateLabel: string;
  pricePerSqft: number;
  annualAppreciation: number;
  rentalYield: number;
  overpricingPercent: number;
  predictedPrice: number;
  predictedPriceLow: number;
  predictedPriceHigh: number;
  amenities: PropertyAmenity[];
  images: string[];
  heroTag: string;
  description: string;
  highlights: string[];
  priceHistory: PriceHistoryPoint[];
  comparables: ComparableProperty[];
  neighborhoodScores: NeighborhoodScore[];
}

export interface PropertySeed {
  id: string;
  title: string;
  city: string;
  tier: 1 | 2 | 3;
  locality: string;
  state: string;
  latitude: number;
  longitude: number;
  address: string;
  price: number;
  bhk: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  furnishing: FurnishingType;
  possession: PossessionStatus;
  verified: boolean;
  builderName: string;
  launchYear: number;
  possessionDateLabel: string;
  amenities: PropertyAmenity[];
  images: string[];
  heroTag: string;
  description: string;
  highlights: string[];
}

export interface PropertyFilters {
  query: string;
  city: string | null;
  propertyType: PropertyType | "all";
  minPrice: number;
  maxPrice: number;
  bhk: number | null;
  furnishing: FurnishingType | "all";
  possession: PossessionStatus | "all";
  verifiedOnly: boolean;
  minAiScore: number;
}

export interface PropertyMetrics {
  totalPortfolioValue: number;
  averageYield: number;
  watchlistGrowth: number;
  activeAlerts: number;
}

export interface EmiCalculationInput {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  tenureYears: number;
}

export interface EmiCalculation {
  propertyId?: string;
  propertyPrice: number;
  downPayment: number;
  downPaymentRatio: number;
  loanAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalLoanRepayment: number;
  totalPayment: number;
  recommendedMonthlyIncome: number;
  interestShare: number;
  source?: "api" | "local";
}

export interface AlertRule {
  id: string;
  title: string;
  city: string;
  trigger: string;
  status: "active" | "paused";
  createdAt: string;
}

export interface PortfolioHolding {
  id: string;
  propertyId: string;
  acquisitionValue: number;
  currentValue: number;
  targetYield: number;
  notes: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

export interface DashboardChartSeries {
  name: string;
  value: number;
}

export interface SearchAreaState {
  geometry: GeoJsonObject | null;
}
