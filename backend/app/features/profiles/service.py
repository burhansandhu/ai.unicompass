from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.features.profiles.models import StudentProfile
from app.features.profiles.schemas import StudentProfileUpdate


def calculate_profile_completeness(profile: StudentProfile) -> int:
    """
    Computes a weighted profile completeness score (0-100%):
    - Academic Metrics: 30%
    - English Language: 25%
    - Financial Budget: 25%
    - Target Preferences & Intake: 20%
    """
    score = 0

    # 1. Academic Metrics (30 points)
    if profile.secondary_grades or profile.higher_secondary_grades:
        score += 10
    if profile.degree_type and profile.degree_field:
        score += 10
    if profile.conferring_university and profile.cgpa is not None:
        score += 10

    # 2. English Proficiency (25 points)
    if profile.moi_eligible:
        score += 25
    elif profile.english_test_type:
        score += 15
        if profile.english_overall_score is not None:
            score += 10

    # 3. Financial Budget (25 points)
    if profile.max_annual_budget_pkr is not None and profile.max_annual_budget_pkr > 0:
        score += 15
    if profile.funding_source:
        score += 10

    # 4. Target Preferences & Intake (20 points)
    if profile.target_destinations and len(profile.target_destinations) > 0:
        score += 10
    if profile.target_intake and (profile.target_field or profile.target_degree_level):
        score += 10

    return min(100, max(0, score))


async def get_or_create_student_profile(db: AsyncSession, user_id: int) -> StudentProfile:
    """Fetch user's profile, or create an initial empty profile if none exists."""
    query = select(StudentProfile).where(StudentProfile.user_id == user_id)
    result = await db.execute(query)
    profile = result.scalar_one_or_none()

    if not profile:
        profile = StudentProfile(user_id=user_id, completeness_percentage=0)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    return profile


async def update_student_profile(
    db: AsyncSession,
    user_id: int,
    data: StudentProfileUpdate,
) -> StudentProfile:
    """Update profile attributes and recalculate real-time completeness percentage."""
    profile = await get_or_create_student_profile(db, user_id)

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(profile, field, value)

    # Recompute completeness score
    profile.completeness_percentage = calculate_profile_completeness(profile)

    await db.commit()
    await db.refresh(profile)
    return profile


async def get_student_profile_by_user_id(db: AsyncSession, user_id: int) -> StudentProfile:
    """Admin inspect specific student lead profile."""
    query = select(StudentProfile).where(StudentProfile.user_id == user_id)
    result = await db.execute(query)
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student profile for user ID {user_id} not found."
        )
    return profile
