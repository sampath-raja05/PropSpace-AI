from fastapi import APIRouter

from app.services.analytics import get_city_allocation, get_dashboard_overview, get_market_momentum, get_property_mix

router = APIRouter()


@router.get("/overview")
def dashboard_overview() -> dict:
    return get_dashboard_overview()


@router.get("/market-momentum")
def dashboard_market_momentum() -> list[dict]:
    return get_market_momentum()


@router.get("/city-allocation")
def dashboard_city_allocation() -> list[dict]:
    return get_city_allocation()


@router.get("/property-mix")
def dashboard_property_mix() -> list[dict]:
    return get_property_mix()
