from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.users.models import User
from app.features.users.service import get_user_by_email
from app.features.auth.schemas import RegisterRequest, LoginRequest
from app.core.security import hash_password, verify_password, create_access_token
from app.core.constants import UserRole


async def register_new_user(db: AsyncSession, req: RegisterRequest) -> User:
    normalized_email = req.email.lower().strip()
    
    # Check if user already exists
    existing_user = await get_user_by_email(db, normalized_email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Hash password and create user
    hashed_pwd = hash_password(req.password)
    user_role = req.role if req.role in [UserRole.STUDENT, UserRole.ADMIN] else UserRole.STUDENT

    new_user = User(
        email=normalized_email,
        hashed_password=hashed_pwd,
        full_name=req.full_name.strip(),
        role=user_role,
        is_active=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


async def authenticate_and_create_token(db: AsyncSession, req: LoginRequest) -> str:
    normalized_email = req.email.lower().strip()
    user = await get_user_by_email(db, normalized_email)

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support.",
        )

    access_token = create_access_token(subject=user.id, role=user.role.value)
    return access_token
