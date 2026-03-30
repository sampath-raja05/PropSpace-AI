from fastapi import APIRouter

from app.services.mock_data import ALERT_RULES, PORTFOLIO_HOLDINGS

router = APIRouter()


@router.get("/portfolio")
def portfolio() -> list[dict]:
    return PORTFOLIO_HOLDINGS


@router.get("/alerts")
def alerts() -> list[dict]:
    return ALERT_RULES
