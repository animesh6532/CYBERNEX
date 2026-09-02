from typing import Optional
from pydantic import BaseModel


class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = "Operator"


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: Optional[str] = None


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: str

    model_config = {"from_attributes": True}
