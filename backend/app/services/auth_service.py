import hashlib
import re
import secrets
from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import Response

from app.core.config import get_settings
from app.core.security import create_access_token
from app.schemas.auth import OTPRequestResponse, SessionUser, TokenResponse


def build_session_user(
    *,
    user_id: str,
    name: str,
    email: str,
    role: str,
    provider: str,
    avatar_url: str | None = None,
    phone: str | None = None,
) -> SessionUser:
    return SessionUser(
        id=user_id,
        name=name,
        email=email,
        role=role,
        provider=provider,
        avatar_url=avatar_url,
        phone=phone,
    )


def build_auth_response(user: SessionUser, response: Response) -> TokenResponse:
    settings = get_settings()
    token = create_access_token(user.model_dump())
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return TokenResponse(access_token=token, user=user)


def clear_auth_cookie(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        samesite=settings.session_cookie_samesite,
    )


def validate_password_strength(password: str) -> str | None:
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    if len(password.encode("utf-8")) > 72:
        return "Password must be 72 bytes or fewer"
    if not re.search(r"[A-Z]", password):
        return "Password must include at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return "Password must include at least one lowercase letter"
    if not re.search(r"\d", password):
        return "Password must include at least one number"
    if not re.search(r"[^A-Za-z0-9]", password):
        return "Password must include at least one special character"
    return None


def normalize_phone_number(phone_number: str) -> str:
    digits = re.sub(r"\D", "", phone_number)
    if len(digits) == 10:
        return f"+91{digits}"
    if 11 <= len(digits) <= 15:
        return f"+{digits}"
    raise ValueError("Enter a valid mobile number")


def mask_phone_number(phone_number: str) -> str:
    visible_tail = phone_number[-4:]
    return f"{phone_number[:3]} {'*' * max(len(phone_number) - 7, 4)} {visible_tail}"


def build_phone_identity(phone_number: str) -> tuple[str, str]:
    digits = re.sub(r"\D", "", phone_number)
    user_id = f"otp-{digits}"
    email = f"phone-{digits}@auth.propspace.ai"
    return user_id, email
@dataclass
class OTPChallenge:
    code_hash: str
    expires_at: datetime
    issued_at: datetime
    attempts_remaining: int
    name: str | None


class OTPChallengeStore:
    def __init__(self) -> None:
        self._store: dict[str, OTPChallenge] = {}

    def _cleanup(self) -> None:
        now = datetime.now(timezone.utc)
        self._store = {
            phone_number: challenge
            for phone_number, challenge in self._store.items()
            if challenge.expires_at > now and challenge.attempts_remaining > 0
        }

    def _hash_code(self, phone_number: str, otp: str) -> str:
        secret = get_settings().jwt_secret_key
        return hashlib.sha256(f"{phone_number}:{otp}:{secret}".encode("utf-8")).hexdigest()

    def issue(self, phone_number: str, name: str | None = None) -> OTPRequestResponse:
        settings = get_settings()
        self._cleanup()
        now = datetime.now(timezone.utc)
        existing = self._store.get(phone_number)

        if existing:
            resend_in_seconds = settings.otp_resend_seconds - int((now - existing.issued_at).total_seconds())
            if resend_in_seconds > 0:
                raise ValueError(f"Please wait {resend_in_seconds} seconds before requesting a new OTP")

        otp = f"{secrets.randbelow(900000) + 100000:06d}"
        expires_at = now + timedelta(minutes=settings.otp_expiry_minutes)
        self._store[phone_number] = OTPChallenge(
            code_hash=self._hash_code(phone_number, otp),
            expires_at=expires_at,
            issued_at=now,
            attempts_remaining=5,
            name=name,
        )

        return OTPRequestResponse(
            message="OTP generated successfully",
            masked_destination=mask_phone_number(phone_number),
            expires_in_seconds=settings.otp_expiry_minutes * 60,
            resend_in_seconds=settings.otp_resend_seconds,
            preview_code=otp if settings.allow_dev_otp_preview else None,
        )

    def verify(self, phone_number: str, otp: str) -> OTPChallenge:
        self._cleanup()
        challenge = self._store.get(phone_number)
        if challenge is None:
            raise ValueError("OTP has expired or was not requested")

        if challenge.expires_at <= datetime.now(timezone.utc):
            self._store.pop(phone_number, None)
            raise ValueError("OTP has expired")

        if challenge.code_hash != self._hash_code(phone_number, otp):
            challenge.attempts_remaining -= 1
            if challenge.attempts_remaining <= 0:
                self._store.pop(phone_number, None)
            raise ValueError("Invalid OTP")

        self._store.pop(phone_number, None)
        return challenge


otp_store = OTPChallengeStore()
