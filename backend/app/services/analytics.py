from collections import Counter
from datetime import datetime
from math import ceil, sin

from app.services.mock_data import ALERT_RULES, PORTFOLIO_HOLDINGS
from app.services.seed_data import build_seed_properties

CITY_BENCHMARKS = {
    "Mumbai": 22000,
    "Bangalore": 11800,
    "Delhi": 13250,
    "Hyderabad": 9600,
    "Chennai": 8900,
    "Coimbatore": 6100,
    "Kochi": 7600,
    "Jaipur": 6400,
    "Lucknow": 5900,
    "Chandigarh": 10800,
    "Salem": 4900,
    "Madurai": 5200,
    "Mysore": 5800,
    "Nagpur": 5400,
    "Indore": 6100,
}

CITY_GROWTH = {
    "Mumbai": 7.2,
    "Bangalore": 8.4,
    "Delhi": 6.6,
    "Hyderabad": 8.1,
    "Chennai": 7.1,
    "Coimbatore": 6.3,
    "Kochi": 6.8,
    "Jaipur": 6.4,
    "Lucknow": 6.7,
    "Chandigarh": 7.0,
    "Salem": 5.6,
    "Madurai": 5.9,
    "Mysore": 6.1,
    "Nagpur": 6.0,
    "Indore": 6.9,
}

CITY_RENTAL = {
    "Mumbai": 2.8,
    "Bangalore": 3.6,
    "Delhi": 3.2,
    "Hyderabad": 3.5,
    "Chennai": 3.1,
    "Coimbatore": 3.0,
    "Kochi": 3.2,
    "Jaipur": 2.9,
    "Lucknow": 3.0,
    "Chandigarh": 3.1,
    "Salem": 2.8,
    "Madurai": 2.9,
    "Mysore": 3.0,
    "Nagpur": 3.1,
    "Indore": 3.3,
}

PROPERTY_TYPE_FACTOR = {"apartment": 1.0, "villa": 1.16, "plot": 0.78, "commercial": 1.1}
FURNISHING_FACTOR = {"unfurnished": 0.94, "semi-furnished": 1.0, "fully furnished": 1.08}
POSSESSION_FACTOR = {"ready": 1.05, "under construction": 0.99, "new launch": 0.95}
WATCHLIST_GROWTH = 14.8


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(value, maximum))


def normalize_signal(value: float, minimum: float, maximum: float) -> float:
    if maximum == minimum:
        return 0

    return clamp((value - minimum) / (maximum - minimum), 0, 1)


def round_metric(value: float, digits: int = 1) -> float:
    return round(value, digits)


def get_score_fingerprint(seed: dict) -> int:
    return sum(ord(character) * (index + 1) for index, character in enumerate(seed["id"]))


def ensure_distinct_ai_scores(items: list[dict]) -> list[dict]:
    assigned_scores: dict[str, float] = {}
    used_scores: set[float] = set()

    for item in sorted(items, key=lambda candidate: (-candidate["ai_investment_score"], candidate["id"])):
        next_score = item["ai_investment_score"]

        while next_score in used_scores:
            next_score = round_metric(max(next_score - 0.1, 58))

        used_scores.add(next_score)
        assigned_scores[item["id"]] = next_score

    return [{**item, "ai_investment_score": assigned_scores.get(item["id"], item["ai_investment_score"])} for item in items]


def ensure_distinct_neighborhood_scores(scores: list[dict]) -> list[dict]:
    used_scores: set[int] = set()
    adjusted_scores: list[dict] = []

    for item in scores:
        next_score = item["score"]
        step = 1

        while next_score in used_scores:
            higher_score = round(clamp(item["score"] + step, 52, 96))
            lower_score = round(clamp(item["score"] - step, 52, 96))

            if higher_score not in used_scores:
                next_score = higher_score
                break

            if lower_score not in used_scores:
                next_score = lower_score
                break

            step += 1

        used_scores.add(next_score)
        adjusted_scores.append({**item, "score": next_score})

    return adjusted_scores


def build_predicted_range(predicted_price: int, seed: dict) -> tuple[int, int]:
    confidence_band = clamp(
        0.05
        + (0.015 if seed["possession"] != "ready" else 0)
        + (0.02 if seed["property_type"] == "plot" else 0.012 if seed["property_type"] == "commercial" else 0.008 if seed["property_type"] == "villa" else 0)
        + (0.01 if seed["tier"] == 3 else 0.006 if seed["tier"] == 2 else 0.004),
        0.05,
        0.11,
    )
    return round(predicted_price * (1 - confidence_band)), round(predicted_price * (1 + confidence_band))


def build_price_history(price: int, annual_appreciation: float) -> list[dict]:
    monthly_rate = annual_appreciation / 100 / 12
    current_month = datetime.now()
    history: list[dict] = []

    for index in range(8):
        months_ago = 7 - index
        price_point = round(price / ((1 + monthly_rate) ** months_ago) * (1 + sin(index) * 0.01))
        month_number = (current_month.month - months_ago - 1) % 12 + 1
        year = current_month.year if current_month.month > months_ago else current_month.year - 1
        history.append({"month": f"{datetime(year, month_number, 1):%b %y}", "price": price_point})

    return history


def build_neighborhood_scores(seed: dict, ai_score: int) -> list[dict]:
    amenity_boost = len(seed["amenities"]) * 0.9
    tier_base = 75 if seed["tier"] == 1 else 69 if seed["tier"] == 2 else 63
    commercial_boost = 5 if seed["property_type"] == "commercial" else 0
    family_boost = 5 if seed["property_type"] == "villa" else 4 if seed["bhk"] >= 3 else -2 if seed["property_type"] == "plot" else 1
    quiet_boost = 4 if seed["property_type"] == "villa" else 5 if seed["property_type"] == "plot" else 0
    greenery_boost = 3 if "garden" in seed["amenities"] else 1 if "pool" in seed["amenities"] else 0
    verified_boost = 3 if seed["verified"] else 0
    density_penalty = 5 if seed["tier"] == 1 else 3 if seed["tier"] == 2 else 1
    metro_boost = 2 if CITY_GROWTH[seed["city"]] >= 7.5 else 0
    readiness_boost = 2 if seed["possession"] == "ready" else 0

    return ensure_distinct_neighborhood_scores(
        [
            {"label": "Connectivity", "score": round(clamp(tier_base + amenity_boost + commercial_boost + 6 + metro_boost, 58, 96))},
            {"label": "Safety", "score": round(clamp(tier_base + verified_boost + quiet_boost + 5, 55, 95))},
            {"label": "Schools", "score": round(clamp(tier_base + family_boost + 2, 56, 94))},
            {
                "label": "Hospitals",
                "score": round(clamp(tier_base + verified_boost + 3 + (3 if seed["tier"] == 1 else 1 if seed["tier"] == 2 else 0), 55, 95)),
            },
            {
                "label": "Traffic",
                "score": round(
                    clamp(79 - density_penalty - commercial_boost + (0 if seed["property_type"] == "apartment" else 2) + readiness_boost, 52, 90)
                ),
            },
            {
                "label": "AQI",
                "score": round(clamp(78 - (8 if seed["tier"] == 1 else 4 if seed["tier"] == 2 else 1) + greenery_boost + quiet_boost, 50, 92)),
            },
            {
                "label": "Noise",
                "score": round(clamp(76 - density_penalty - commercial_boost + quiet_boost + greenery_boost + ai_score * 0.02, 50, 92)),
            },
        ]
    )


def enrich_property(seed: dict) -> dict:
    predicted_price = round(
        CITY_BENCHMARKS[seed["city"]]
        * seed["sqft"]
        * PROPERTY_TYPE_FACTOR[seed["property_type"]]
        * FURNISHING_FACTOR[seed["furnishing"]]
        * POSSESSION_FACTOR[seed["possession"]]
    )
    price_per_sqft = round(seed["price"] / max(seed["sqft"], 1))
    raw_overpricing = ((seed["price"] - predicted_price) / max(predicted_price, 1)) * 100
    overpricing_percent = round(clamp(raw_overpricing, -18, 22), 1)
    predicted_price_low, predicted_price_high = build_predicted_range(predicted_price, seed)
    annual_appreciation = round(
        clamp(
            CITY_GROWTH[seed["city"]]
            + len(seed["amenities"]) * 0.12
            + (0.4 if seed["verified"] else 0)
            + (0.5 if seed["possession"] == "under construction" else 0.7 if seed["possession"] == "new launch" else 0),
            5.2,
            10.8,
        ),
        1,
    )
    rental_yield = round(
        clamp(
            CITY_RENTAL[seed["city"]]
            + (1.4 if seed["property_type"] == "commercial" else -0.3 if seed["property_type"] == "villa" else -1.2 if seed["property_type"] == "plot" else 0.2)
            + (0.25 if seed["furnishing"] == "fully furnished" else 0),
            1.6,
            6.1,
        ),
        1,
    )
    appreciation_signal = normalize_signal(annual_appreciation, 5.2, 10.8)
    yield_signal = normalize_signal(rental_yield, 1.6, 6.1)
    value_signal = clamp((22 - overpricing_percent) / 40, 0, 1)
    amenity_signal = normalize_signal(len(seed["amenities"]), 3, 7)
    benchmark_signal = clamp(1 - abs(price_per_sqft / max(CITY_BENCHMARKS[seed["city"]], 1) - 1) * 0.75, 0, 1)
    quality_signal = sum(
        [
            1 if seed["tier"] == 1 else 0.76 if seed["tier"] == 2 else 0.62,
            1 if seed["verified"] else 0.65,
            0.92 if seed["possession"] == "ready" else 0.82 if seed["possession"] == "under construction" else 0.78,
            1 if seed["furnishing"] == "fully furnished" else 0.86 if seed["furnishing"] == "semi-furnished" else 0.72,
            0.94 if seed["property_type"] == "commercial" else 0.9 if seed["property_type"] == "villa" else 0.86 if seed["property_type"] == "apartment" else 0.68,
        ]
    ) / 5
    fingerprint_adjustment = (((get_score_fingerprint(seed) % 97) / 97) - 0.5) * 1.2 + (((seed["sqft"] + seed["launch_year"]) % 11) - 5) * 0.04
    ai_score = round_metric(
        clamp(
            48
            + appreciation_signal * 11
            + yield_signal * 10
            + value_signal * 13
            + amenity_signal * 4
            + quality_signal * 7
            + benchmark_signal * 4
            + fingerprint_adjustment,
            58,
            95.8,
        )
    )

    return {
        **seed,
        "ai_investment_score": ai_score,
        "predicted_price": predicted_price,
        "price_per_sqft": price_per_sqft,
        "annual_appreciation": annual_appreciation,
        "rental_yield": rental_yield,
        "overpricing_percent": overpricing_percent,
        "price_history": build_price_history(seed["price"], annual_appreciation),
        "predicted_price_low": predicted_price_low,
        "predicted_price_high": predicted_price_high,
        "comparables": [],
        "neighborhood_scores": build_neighborhood_scores(seed, ai_score),
    }


def get_properties() -> list[dict]:
    raw_properties = build_seed_properties()
    enriched = ensure_distinct_ai_scores([enrich_property(seed) for seed in raw_properties])

    for property_data in enriched:
        comparables = [
            candidate
            for candidate in enriched
            if candidate["id"] != property_data["id"] and candidate["city"] == property_data["city"]
        ]
        comparables.sort(
            key=lambda item: abs(item["price"] - property_data["price"]) + abs(item["sqft"] - property_data["sqft"]) * 4000
        )
        property_data["comparables"] = [
            {
                "name": candidate["title"],
                "distance_km": round(abs(candidate["latitude"] - property_data["latitude"]) * 111, 1),
                "price": candidate["price"],
                "sqft": candidate["sqft"],
            }
            for candidate in comparables[:3]
        ]

    return enriched


def get_featured_properties(limit: int = 6) -> list[dict]:
    return sorted(get_properties(), key=lambda item: item["ai_investment_score"], reverse=True)[:limit]


def get_property_by_id(property_id: str) -> dict | None:
    return next(
        (property_data for property_data in get_properties() if property_data["id"] == property_id or property_data["slug"] == property_id),
        None,
    )


def get_property_valuation(property_id: str) -> dict | None:
    property_data = get_property_by_id(property_id)
    if not property_data:
        return None

    return {
        "property_id": property_data["id"],
        "predicted_price": property_data["predicted_price"],
        "overpricing_percent": property_data["overpricing_percent"],
        "rental_yield": property_data["rental_yield"],
        "annual_appreciation": property_data["annual_appreciation"],
        "ai_investment_score": property_data["ai_investment_score"],
        "confidence": 0.86,
    }


def calculate_emi(property_price: int, down_payment: int, annual_interest_rate: float, tenure_years: int) -> dict:
    safe_property_price = max(round(property_price), 0)
    safe_down_payment = max(0, min(round(down_payment), safe_property_price))
    safe_interest_rate = clamp(annual_interest_rate, 0, 25)
    safe_tenure_years = max(min(round(tenure_years), 30), 5)
    tenure_months = safe_tenure_years * 12
    loan_amount = max(safe_property_price - safe_down_payment, 0)
    monthly_rate = safe_interest_rate / 1200

    if loan_amount == 0:
        monthly_emi = 0
    elif monthly_rate == 0:
        monthly_emi = loan_amount / tenure_months
    else:
        growth_factor = (1 + monthly_rate) ** tenure_months
        monthly_emi = loan_amount * monthly_rate * growth_factor / (growth_factor - 1)

    total_loan_repayment = monthly_emi * tenure_months
    total_interest = max(total_loan_repayment - loan_amount, 0)

    return {
        "property_price": safe_property_price,
        "down_payment": safe_down_payment,
        "down_payment_ratio": round((safe_down_payment / safe_property_price) * 100, 1) if safe_property_price else 0,
        "loan_amount": round(loan_amount),
        "annual_interest_rate": round(safe_interest_rate, 2),
        "tenure_years": safe_tenure_years,
        "tenure_months": tenure_months,
        "monthly_emi": round(monthly_emi),
        "total_interest": round(total_interest),
        "total_loan_repayment": round(total_loan_repayment),
        "total_payment": round(total_loan_repayment + safe_down_payment),
        "recommended_monthly_income": ceil(monthly_emi / 0.4) if monthly_emi else 0,
        "interest_share": round((total_interest / total_loan_repayment) * 100, 1) if total_loan_repayment else 0,
    }


def get_property_emi(
    property_id: str,
    down_payment: int | None = None,
    annual_interest_rate: float = 8.5,
    tenure_years: int = 20,
) -> dict | None:
    property_data = get_property_by_id(property_id)
    if not property_data:
        return None

    suggested_down_payment = round(property_data["price"] * 0.2) if down_payment is None else down_payment

    return {
        "property_id": property_data["id"],
        **calculate_emi(
            property_price=property_data["price"],
            down_payment=suggested_down_payment,
            annual_interest_rate=annual_interest_rate,
            tenure_years=tenure_years,
        ),
    }


def get_dashboard_overview() -> dict:
    properties_by_id = {property_data["id"]: property_data for property_data in get_properties()}
    tracked_yields = [
        properties_by_id[holding["property_id"]]["rental_yield"]
        for holding in PORTFOLIO_HOLDINGS
        if holding["property_id"] in properties_by_id
    ]

    return {
        "total_portfolio_value": sum(holding["current_value"] for holding in PORTFOLIO_HOLDINGS),
        "average_yield": round(sum(tracked_yields) / len(tracked_yields), 1) if tracked_yields else 0,
        "watchlist_growth": WATCHLIST_GROWTH,
        "active_alerts": sum(1 for alert in ALERT_RULES if alert["status"] == "active"),
    }


def get_market_momentum(limit: int = 6) -> list[dict]:
    city_scores: dict[str, list[int]] = {}

    for property_data in get_properties():
        city_scores.setdefault(property_data["city"], []).append(property_data["ai_investment_score"])

    momentum = [
        {
            "name": city,
            "value": round(sum(scores) / len(scores)),
        }
        for city, scores in city_scores.items()
    ]

    return sorted(momentum, key=lambda item: item["value"], reverse=True)[:limit]


def get_city_allocation() -> list[dict]:
    tier_counts = Counter(property_data["tier"] for property_data in get_properties())

    return [
        {"name": "Tier 1", "value": tier_counts.get(1, 0)},
        {"name": "Tier 2", "value": tier_counts.get(2, 0)},
        {"name": "Tier 3", "value": tier_counts.get(3, 0)},
    ]


def get_property_mix() -> list[dict]:
    property_counts = Counter(property_data["property_type"] for property_data in get_properties())

    return [
        {"name": "Apartments", "value": property_counts.get("apartment", 0)},
        {"name": "Villas", "value": property_counts.get("villa", 0)},
        {"name": "Plots", "value": property_counts.get("plot", 0)},
        {"name": "Commercial", "value": property_counts.get("commercial", 0)},
    ]


def get_recommendations(city: str | None = None, limit: int = 6) -> list[dict]:
    properties = get_properties()
    if city:
        properties = [property_data for property_data in properties if property_data["city"].lower() == city.lower()]

    return sorted(properties, key=lambda item: item["ai_investment_score"], reverse=True)[:limit]
