from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.constants import UserRole
from app.features.users.models import User
from app.features.profiles.schemas import StudentProfileRead, StudentProfileUpdate
from app.features.profiles.service import (
    get_or_create_student_profile,
    update_student_profile,
    get_student_profile_by_user_id,
)

router = APIRouter(prefix="/profile", tags=["Student Profile & Academic Metrics"])


@router.get("/me", response_model=StudentProfileRead, summary="Get current logged-in student profile")
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_or_create_student_profile(db, user_id=current_user.id)


@router.put("/me", response_model=StudentProfileRead, summary="Update current logged-in student profile")
async def update_my_profile(
    payload: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_student_profile(db, user_id=current_user.id, data=payload)


@router.get(
    "/users/{user_id}",
    response_model=StudentProfileRead,
    summary="Admin review of a specific student's profile",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_get_student_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await get_student_profile_by_user_id(db, user_id=user_id)
