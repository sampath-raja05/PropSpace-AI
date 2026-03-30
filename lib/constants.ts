export const appConfig = {
  name: "PropSpace AI",
  description:
    "AI-assisted property intelligence for premium real-estate discovery, investment analysis, and portfolio planning across India.",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"
};

export const propertyTypes = ["apartment", "villa", "plot", "commercial"] as const;
export const furnishingTypes = ["unfurnished", "semi-furnished", "fully furnished"] as const;
export const possessionStatuses = ["ready", "under construction", "new launch"] as const;
export const userRoles = ["investor", "advisor", "admin"] as const;

export const tierOneCities = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai"] as const;
export const tierTwoCities = ["Coimbatore", "Kochi", "Jaipur", "Lucknow", "Chandigarh"] as const;
export const tierThreeCities = ["Salem", "Madurai", "Mysore", "Nagpur", "Indore"] as const;
