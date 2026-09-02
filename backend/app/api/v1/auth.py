import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserProfile
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, summary="Register User")
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )

    user_id = f"user-{uuid.uuid4().hex[:8]}"
    db_user = models.User(
        id=user_id,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name or "Operator",
        role="Operator"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token({"sub": db_user.id, "email": db_user.email})
    return TokenResponse(
        access_token=token,
        user_id=db_user.id,
        email=db_user.email,
        full_name=db_user.full_name
    )


@router.post("/login", response_model=TokenResponse, summary="Login User")
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token({"sub": user.id, "email": user.email})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name
    )


@router.get("/me", response_model=UserProfile, summary="Get Current User Profile")
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
