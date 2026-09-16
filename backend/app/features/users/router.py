from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.constants import UserRole
from app.features.users.models import User
from app.features.profiles.models import StudentProfile
from app.features.discovery.models import University, Program, ShortlistedProgram
from app.features.content.models import Country, Post
from app.features.scholarships.models import Scholarship

router = APIRouter(prefix="/admin", tags=["Admin Central & Lead Management"])


class AdminStudentLead(BaseModel):
    id: int
    name: str
    email: str
    target: str
    registered: str
    completeness: int
    shortlisted_count: int
    status: str
    status_color: str

    model_config = ConfigDict(from_attributes=True)


class AdminPlatformStats(BaseModel):
    total_students: int
    total_universities: int
    total_programs: int
    total_scholarships: int
    published_articles: int
    live_destinations: int


@router.get(
    "/students",
    response_model=List[AdminStudentLead],
    summary="Admin: Get real registered student leads and inquiry statuses",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def get_admin_students(db: AsyncSession = Depends(get_db)):
    # Query all students
    query = (
        select(User)
        .where(User.role == UserRole.STUDENT)
        .order_by(User.created_at.desc())
    )
    res = await db.execute(query)
    students = res.scalars().all()

    leads = []
    for s in students:
        # Get profile
        p_res = await db.execute(select(StudentProfile).where(StudentProfile.user_id == s.id))
        prof = p_res.scalar_one_or_none()

        # Count shortlisted
        sh_res = await db.execute(
            select(func.count(ShortlistedProgram.id)).where(ShortlistedProgram.user_id == s.id)
        )
        sh_count = sh_res.scalar_one() or 0

        target_desc = "Exploring Destinations"
        completeness = 0
        if prof:
            completeness = prof.completeness_percentage or 0
            dests = prof.target_destinations
            dest_str = ", ".join(dests).title() if isinstance(dests, list) and dests else ""
            field = prof.target_field or prof.degree_field or "General"
            level = prof.target_degree_level or prof.degree_level or "Masters"
            if dest_str:
                target_desc = f"{dest_str} ({level} in {field})"
            elif field != "General":
                target_desc = f"{level} in {field}"

        status_text = "New Lead"
        status_color = "bg-slate-100 text-slate-700 border-slate-200"
        if completeness >= 80:
            status_text = f"Profile {completeness}%"
            status_color = "bg-emerald-50 text-emerald-700 border-emerald-200"
        elif sh_count > 0:
            status_text = f"Shortlisted ({sh_count})"
            status_color = "bg-blue-50 text-blue-700 border-blue-200"
        elif completeness >= 40:
            status_text = "Needs Attestation"
            status_color = "bg-amber-50 text-amber-700 border-amber-200"

        reg_str = s.created_at.strftime("%d %b %Y, %H:%M") if s.created_at else "Recently"

        leads.append(
            AdminStudentLead(
                id=s.id,
                name=s.full_name,
                email=s.email,
                target=target_desc,
                registered=reg_str,
                completeness=completeness,
                shortlisted_count=sh_count,
                status=status_text,
                status_color=status_color,
            )
        )

    return leads


@router.get(
    "/stats",
    response_model=AdminPlatformStats,
    summary="Admin: Get real live platform statistics",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    st_res = await db.execute(select(func.count(User.id)).where(User.role == UserRole.STUDENT))
    total_students = st_res.scalar_one() or 0

    uni_res = await db.execute(select(func.count(University.id)).where(University.is_active == True))
    total_universities = uni_res.scalar_one() or 0

    prog_res = await db.execute(select(func.count(Program.id)).where(Program.is_active == True))
    total_programs = prog_res.scalar_one() or 0

    sch_res = await db.execute(select(func.count(Scholarship.id)).where(Scholarship.is_active == True))
    total_scholarships = sch_res.scalar_one() or 0

    post_res = await db.execute(select(func.count(Post.id)).where(Post.is_published == True))
    published_articles = post_res.scalar_one() or 0

    ctry_res = await db.execute(select(func.count(Country.id)).where(Country.is_active == True))
    live_destinations = ctry_res.scalar_one() or 0

    return AdminPlatformStats(
        total_students=total_students,
        total_universities=total_universities,
        total_programs=total_programs,
        total_scholarships=total_scholarships,
        published_articles=published_articles,
        live_destinations=live_destinations,
    )
