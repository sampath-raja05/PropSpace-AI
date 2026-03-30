from pydantic import BaseModel


class PriceHistoryPoint(BaseModel):
    month: str
    price: int


class ComparableProperty(BaseModel):
    name: str
    distance_km: float
    price: int
    sqft: int


class NeighborhoodScore(BaseModel):
    label: str
    score: int


class PropertyResponse(BaseModel):
    id: str
    slug: str
    title: str
    city: str
    tier: int
    locality: str
    state: str
    latitude: float
    longitude: float
    address: str
    price: int
    bhk: int
    baths: int
    sqft: int
    property_type: str
    furnishing: str
    possession: str
    verified: bool
    ai_investment_score: float
    builder_name: str
    launch_year: int
    possession_date_label: str
    price_per_sqft: int
    annual_appreciation: float
    rental_yield: float
    overpricing_percent: float
    predicted_price: int
    predicted_price_low: int
    predicted_price_high: int
    amenities: list[str]
    images: list[str]
    hero_tag: str
    description: str
    highlights: list[str]
    price_history: list[PriceHistoryPoint]
    comparables: list[ComparableProperty]
    neighborhood_scores: list[NeighborhoodScore]


class EMICalculationResponse(BaseModel):
    property_id: str
    property_price: int
    down_payment: int
    down_payment_ratio: float
    loan_amount: int
    annual_interest_rate: float
    tenure_years: int
    tenure_months: int
    monthly_emi: int
    total_interest: int
    total_loan_repayment: int
    total_payment: int
    recommended_monthly_income: int
    interest_share: float
