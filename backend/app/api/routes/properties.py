from fastapi import APIRouter, HTTPException, Query

from app.schemas.property import EMICalculationResponse
from app.services.analytics import get_featured_properties, get_properties, get_property_by_id, get_property_emi

router = APIRouter()


@router.get("")
def list_properties() -> list[dict]:
    return get_properties()


@router.get("/featured")
def list_featured_properties() -> list[dict]:
    return get_featured_properties()


@router.get("/{property_id}/emi", response_model=EMICalculationResponse)
def calculate_property_emi(
    property_id: str,
    down_payment: int | None = Query(default=None, ge=0),
    annual_interest_rate: float = Query(default=8.5, ge=0, le=25),
    tenure_years: int = Query(default=20, ge=5, le=30),
) -> dict:
    emi_data = get_property_emi(
        property_id=property_id,
        down_payment=down_payment,
        annual_interest_rate=annual_interest_rate,
        tenure_years=tenure_years,
    )
    if not emi_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return emi_data


@router.get("/{property_id}")
def retrieve_property(property_id: str) -> dict:
    property_data = get_property_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data
