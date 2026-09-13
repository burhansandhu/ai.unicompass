from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.features.users.models import User
from app.features.timeline.schemas import TimelineSummaryRead, MilestoneUpdatePayload, MilestoneItemRead
from app.features.timeline.service import (
    calculate_timeline_summary,
    update_milestone_status,
    generate_icalendar_content,
)

router = APIRouter(prefix="/timeline", tags=["Reverse Timeline & Deadline Engine"])


@router.get("/summary", response_model=TimelineSummaryRead, summary="Get student reverse intake timeline & deadlines")
async def get_my_timeline(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await calculate_timeline_summary(db, user_id=current_user.id)


@router.put("/milestones/{milestone_key}", summary="Update a timeline milestone status or notes")
async def update_my_milestone(
    milestone_key: str,
    payload: MilestoneUpdatePayload,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    record = await update_milestone_status(
        session=db,
        user_id=current_user.id,
        milestone_key=milestone_key,
        payload=payload,
    )
    return {
        "success": True,
        "milestone_key": record.milestone_key,
        "is_completed": record.is_completed,
        "notes": record.notes,
    }


@router.get("/export.ics", summary="Export timeline milestones and deadlines as iCalendar (.ics)")
async def export_calendar(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ics_text = await generate_icalendar_content(db, user_id=current_user.id)
    return Response(
        content=ics_text,
        media_type="text/calendar",
        headers={
            "Content-Disposition": f'attachment; filename="unicompass_intake_timeline_{current_user.id}.ics"'
        },
    )
