PORTFOLIO_HOLDINGS = [
    {
        "id": "hold-1",
        "property_id": "mumbai-powai-lakefront-boulevard",
        "acquisition_value": 22300000,
        "current_value": 24800000,
        "target_yield": 3.4,
        "notes": "Core long-term hold",
    },
    {
        "id": "hold-2",
        "property_id": "bangalore-whitefield-orbit-heights",
        "acquisition_value": 18100000,
        "current_value": 19500000,
        "target_yield": 4.2,
        "notes": "Growth corridor position",
    },
    {
        "id": "hold-3",
        "property_id": "hyderabad-gachibowli-verde-homes",
        "acquisition_value": 16500000,
        "current_value": 17600000,
        "target_yield": 4.0,
        "notes": "Pre-completion upside",
    },
    {
        "id": "hold-4",
        "property_id": "coimbatore-rs-puram-lotus-enclave",
        "acquisition_value": 8100000,
        "current_value": 8900000,
        "target_yield": 3.2,
        "notes": "Stable yield asset",
    },
]

ALERT_RULES = [
    {
        "id": "alert-1",
        "title": "Mumbai underpriced opportunities",
        "city": "Mumbai",
        "trigger": "AI score above 85 and overpricing below 2%",
        "status": "active",
        "created_at": "2026-03-12",
    },
    {
        "id": "alert-2",
        "title": "Bangalore villa launches",
        "city": "Bangalore",
        "trigger": "New villa inventory above 2500 sqft",
        "status": "active",
        "created_at": "2026-03-05",
    },
    {
        "id": "alert-3",
        "title": "Tier 2 yield watchlist",
        "city": "Kochi",
        "trigger": "Rental yield above 3.5%",
        "status": "paused",
        "created_at": "2026-02-18",
    },
]

DASHBOARD_OVERVIEW = {
    "total_portfolio_value": sum(holding["current_value"] for holding in PORTFOLIO_HOLDINGS),
    "average_yield": 3.4,
    "watchlist_growth": 14.8,
    "active_alerts": sum(1 for alert in ALERT_RULES if alert["status"] == "active"),
}

MARKET_MOMENTUM = [
    {"name": "Mumbai", "value": 78},
    {"name": "Bangalore", "value": 86},
    {"name": "Hyderabad", "value": 84},
    {"name": "Chennai", "value": 73},
    {"name": "Kochi", "value": 69},
    {"name": "Indore", "value": 71},
]

CITY_ALLOCATION = [
    {"name": "Tier 1", "value": 48},
    {"name": "Tier 2", "value": 31},
    {"name": "Tier 3", "value": 21},
]

PROPERTY_MIX = [
    {"name": "Apartments", "value": 16},
    {"name": "Villas", "value": 8},
    {"name": "Plots", "value": 3},
    {"name": "Commercial", "value": 3},
]
