from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
REPO_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    app_name: str = "PropSpace AI API"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://postgres:postgres@db:5432/propspace"
    jwt_secret_key: str = "change-me"
    access_token_expire_minutes: int = 120
    session_cookie_name: str = "propspace_session"
    session_cookie_secure: bool = False
    session_cookie_samesite: str = "lax"
    otp_expiry_minutes: int = 5
    otp_resend_seconds: int = 60
    allow_dev_otp_preview: bool = True
    allowed_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=(
            BACKEND_DIR / ".env",
            REPO_ROOT / ".env",
            REPO_ROOT / ".env.local",
        ),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
