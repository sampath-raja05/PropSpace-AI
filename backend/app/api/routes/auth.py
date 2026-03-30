import secrets

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.core.security import get_password_hash, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LogoutResponse, OTPRequest, OTPRequestResponse, OTPVerifyRequest, PasswordLoginRequest, RegisterRequest, SessionUser, TokenResponse
from app.services.auth_service import (
    build_auth_response,
    build_phone_identity,
    build_session_user,
    clear_auth_cookie,
    normalize_phone_number,
    otp_store,
    validate_password_strength,
)

router = APIRouter()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def to_session_user(user: User, *, provider: str = "password", avatar_url: str | None = None, phone: str | None = None) -> SessionUser:
    return build_session_user(
        user_id=user.id,
        name=user.full_name,
        email=user.email,
        role=user.role,
        provider=provider,
        avatar_url=avatar_url,
        phone=phone,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: PasswordLoginRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    user = get_user_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return build_auth_response(to_session_user(user), response)


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    password_error = validate_password_strength(payload.password)
    if password_error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=password_error)

    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    user = User(
        full_name=payload.name.strip(),
        email=payload.email.lower(),
        hashed_password=get_password_hash(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return build_auth_response(to_session_user(user), response)

@router.post("/otp/request", response_model=OTPRequestResponse)
def request_otp(payload: OTPRequest) -> OTPRequestResponse:
    try:
        normalized_phone = normalize_phone_number(payload.phone_number)
        return otp_store.issue(normalized_phone, payload.name)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/otp/verify", response_model=TokenResponse)
def verify_otp(payload: OTPVerifyRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    try:
        normalized_phone = normalize_phone_number(payload.phone_number)
        challenge = otp_store.verify(normalized_phone, payload.otp)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    user_id, synthetic_email = build_phone_identity(normalized_phone)
    user = get_user_by_email(db, synthetic_email)
    if user is None:
        user = User(
            id=user_id,
            full_name=(payload.name or challenge.name or f"Phone User {normalized_phone[-4:]}").strip(),
            email=synthetic_email,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),
            role="investor",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return build_auth_response(
        to_session_user(user, provider="otp", phone=normalized_phone),
        response,
    )


@router.post("/logout", response_model=LogoutResponse)
def logout(response: Response) -> LogoutResponse:
    clear_auth_cookie(response)
    return LogoutResponse()


@router.get("/me", response_model=SessionUser)
def me(user: dict = Depends(get_current_user)) -> SessionUser:
    return SessionUser(**user)


@router.get("/roles/admin-preview")
def admin_preview(user: dict = Depends(require_roles("admin"))) -> dict:
    return {"status": "ok", "message": "Admin access granted", "user": user}
