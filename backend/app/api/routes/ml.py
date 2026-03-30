from fastapi import APIRouter, HTTPException

from app.services.analytics import get_property_valuation, get_recommendations

router = APIRouter()


@router.get("/valuation/{property_id}")
def valuation(property_id: str) -> dict:
    valuation_data = get_property_valuation(property_id)
    if not valuation_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return valuation_data


@router.get("/recommendations")
def recommendations(city: str | None = None, limit: int = 6) -> list[dict]:
    return get_recommendations(city=city, limit=limit)
