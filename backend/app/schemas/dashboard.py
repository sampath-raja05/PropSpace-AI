from pydantic import BaseModel


class DashboardOverviewResponse(BaseModel):
    total_portfolio_value: int
    average_yield: float
    watchlist_growth: float
    active_alerts: int


class PortfolioHoldingResponse(BaseModel):
    id: str
    property_id: str
    acquisition_value: int
    current_value: int
    target_yield: float
    notes: str


class AlertRuleResponse(BaseModel):
    id: str
    title: str
    city: str
    trigger: str
    status: str
    created_at: str
