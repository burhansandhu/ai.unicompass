from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.features.users.models import User
from app.features.attestation.schemas import (
    AttestationSummaryRead,
    AttestationStepRead,
    AttestationStepUpdate,
    AttestationGuideItem,
)
from app.features.attestation.service import (
    get_or_create_student_attestation_steps,
    update_student_attestation_step,
    get_all_guidelines,
)

router = APIRouter(prefix="/attestation", tags=["Attestation & Document Legalization"])


@router.get(
    "/steps",
    response_model=AttestationSummaryRead,
    summary="Get or initialize student attestation steps with overall progress",
)
async def get_my_attestation_steps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_or_create_student_attestation_steps(db, user_id=current_user.id)


@router.put(
    "/steps/{step_key}",
    response_model=AttestationStepRead,
    summary="Update a specific attestation step (status, notes, tracking, appointment)",
)
async def update_my_attestation_step(
    step_key: str,
    payload: AttestationStepUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_student_attestation_step(
        db,
        user_id=current_user.id,
        step_key=step_key,
        payload=payload,
    )


@router.get(
    "/guidelines",
    response_model=List[AttestationGuideItem],
    summary="Get comprehensive Pakistani government attestation guidelines & requirements",
)
async def get_attestation_guidelines():
    return get_all_guidelines()
