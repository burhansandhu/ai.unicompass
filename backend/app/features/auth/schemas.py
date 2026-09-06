from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.core.constants import UserRole
from app.features.users.schemas import UserRead


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Full name of the user")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, max_length=100, description="Password must be at least 8 characters")
    role: Optional[UserRole] = Field(default=UserRole.STUDENT, description="Role: student or admin")


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")


class RegisterResponse(BaseModel):
    user: UserRead


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserRead] = None


class MessageResponse(BaseModel):
    message: str
