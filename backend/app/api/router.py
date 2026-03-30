from fastapi import APIRouter

from app.api.routes import auth, dashboard, engagement, health, ml, properties, reports

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(engagement.router, tags=["engagement"])
api_router.include_router(ml.router, prefix="/ml", tags=["ml"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
