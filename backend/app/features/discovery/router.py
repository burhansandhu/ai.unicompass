from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user
from app.features.users.models import User
from app.features.profiles.models import StudentProfile
from app.features.discovery.schemas import (
    ProgramRead,
    UniversityRead,
    ShortlistedProgramItem,
    ShortlistToggleResponse,
)
from app.features.discovery.service import (
    filter_programs,
    get_all_universities,
    toggle_shortlist_program,
    get_student_shortlist,
)
from app.features.discovery.models import Program, University
from app.features.content.models import Country
from app.features.discovery.service import build_program_read

router = APIRouter(prefix="/discovery", tags=["University & Program Discovery"])


@router.get("/programs", response_model=List[ProgramRead], summary="Search and filter university programs with PKR costs")
async def list_programs(
    search: Optional[str] = Query(None, description="Search by program, discipline, or university name"),
    country_slug: Optional[str] = Query(None, description="Filter by destination country slug"),
    degree_level: Optional[str] = Query(None, description="Filter by degree level: Bachelors, Masters, PhD"),
    discipline: Optional[str] = Query(None, description="Filter by field of study"),
    max_budget_pkr: Optional[float] = Query(None, description="Max annual budget in PKR (tuition + living)"),
    moi_only: Optional[bool] = Query(None, description="Show only programs accepting Pakistani MOI English waivers"),
    match_my_profile: Optional[bool] = Query(False, description="Filter and score against logged-in student profile"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    student_profile = None
    if current_user and match_my_profile:
        p_res = await db.execute(
            select(StudentProfile).where(StudentProfile.user_id == current_user.id)
        )
        student_profile = p_res.scalar_one_or_none()

    user_id = current_user.id if current_user else None
    return await filter_programs(
        session=db,
        search=search,
        country_slug=country_slug,
        degree_level=degree_level,
        discipline=discipline,
        max_budget_pkr=max_budget_pkr,
        moi_only=moi_only,
        user_id=user_id,
        student_profile=student_profile,
        limit=limit,
        offset=offset,
    )


@router.get("/programs/matched", response_model=List[ProgramRead], summary="Get programs matched to student profile")
async def get_matched_programs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    p_res = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    student_profile = p_res.scalar_one_or_none()

    # If student has target destinations or degree preferences, use them
    target_country = None
    target_degree = student_profile.degree_level if student_profile else None
    max_budget = student_profile.max_annual_budget_pkr if student_profile else None

    return await filter_programs(
        session=db,
        degree_level=target_degree,
        max_budget_pkr=max_budget,
        user_id=current_user.id,
        student_profile=student_profile,
        limit=50,
    )


@router.get("/universities", response_model=List[UniversityRead], summary="List partner universities and MOI policies")
async def list_universities(
    db: AsyncSession = Depends(get_db),
):
    return await get_all_universities(db)


@router.get("/programs/{program_id}", response_model=ProgramRead, summary="Get single program details")
async def get_program(
    program_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Program, University, Country)
        .join(University, Program.university_id == University.id)
        .join(Country, University.country_id == Country.id)
        .where(Program.id == program_id)
    )
    res = await db.execute(query)
    row = res.first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    prog, uni, ctry = row
    student_profile = None
    is_sh = False
    if current_user:
        p_res = await db.execute(
            select(StudentProfile).where(StudentProfile.user_id == current_user.id)
        )
        student_profile = p_res.scalar_one_or_none()
        # Check shortlist
        from app.features.discovery.models import ShortlistedProgram
        sh_res = await db.execute(
            select(ShortlistedProgram.id).where(
                ShortlistedProgram.user_id == current_user.id,
                ShortlistedProgram.program_id == program_id,
            )
        )
        is_sh = sh_res.scalar_one_or_none() is not None

    return build_program_read(prog, ctry, uni, is_shortlisted=is_sh, student_profile=student_profile)


@router.post("/programs/{program_id}/shortlist", response_model=ShortlistToggleResponse, summary="Toggle program shortlist")
async def toggle_shortlist(
    program_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify program exists
    p_res = await db.execute(select(Program.id).where(Program.id == program_id))
    if not p_res.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    return await toggle_shortlist_program(db, user_id=current_user.id, program_id=program_id)


@router.get("/student/shortlist", response_model=List[ShortlistedProgramItem], summary="Get student's shortlisted programs")
async def get_my_shortlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_student_shortlist(db, user_id=current_user.id)
