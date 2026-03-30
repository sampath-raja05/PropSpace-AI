from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class SessionUser(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    provider: str
    avatar_url: str | None = None
    phone: str | None = None


class PasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RegisterRequest(PasswordLoginRequest):
    name: str = Field(min_length=2, max_length=120)
    role: Literal["investor", "advisor"] = "investor"

class OTPRequest(BaseModel):
    phone_number: str = Field(min_length=10, max_length=20)
    name: str | None = Field(default=None, min_length=2, max_length=120)


class OTPVerifyRequest(OTPRequest):
    otp: str = Field(min_length=6, max_length=6)


class OTPRequestResponse(BaseModel):
    message: str
    masked_destination: str
    expires_in_seconds: int
    resend_in_seconds: int
    preview_code: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: SessionUser


class LogoutResponse(BaseModel):
    message: str = "Signed out"
