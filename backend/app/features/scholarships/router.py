from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_optional_current_user, require_role
from app.core.constants import UserRole
from app.features.users.models import User
from app.features.scholarships.schemas import (
    ScholarshipCreate,
    ScholarshipUpdate,
    ScholarshipRead,
    ScholarshipToggleResponse,
    SavedScholarshipItem,
)
from app.features.scholarships.service import (
    filter_scholarships,
    get_scholarship_by_id_or_slug,
    create_scholarship,
    update_scholarship,
    delete_scholarship,
    toggle_save_scholarship,
    get_student_saved_scholarships,
)

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])


@router.get("", response_model=List[ScholarshipRead], summary="Search and filter verified international scholarships")
async def list_scholarships(
    search: Optional[str] = Query(None, description="Search by title, provider, or country"),
    country_slug: Optional[str] = Query(None, description="Filter by destination country slug"),
    degree_level: Optional[str] = Query(None, description="Filter by degree level: Bachelors, Masters, PhD, All Levels"),
    coverage_type: Optional[str] = Query(None, description="Filter by coverage: Fully Funded, Full Tuition, Partial, Stipend"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    return await filter_scholarships(
        session=db,
        search=search,
        country_slug=country_slug,
        degree_level=degree_level,
        coverage_type=coverage_type,
        user_id=user_id,
        limit=limit,
        offset=offset,
    )


@router.get("/student/saved", response_model=List[SavedScholarshipItem], summary="Get logged-in student's saved scholarships")
async def get_my_saved_scholarships(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_student_saved_scholarships(db, user_id=current_user.id)


@router.get("/{id_or_slug}", response_model=ScholarshipRead, summary="Get single scholarship details by ID or slug")
async def get_scholarship(
    id_or_slug: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    s = await get_scholarship_by_id_or_slug(db, id_or_slug=id_or_slug, user_id=user_id)
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found")
    return s


@router.post("/{scholarship_id}/save", response_model=ScholarshipToggleResponse, summary="Toggle save/bookmark scholarship")
async def toggle_save(
    scholarship_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await toggle_save_scholarship(db, user_id=current_user.id, scholarship_id=scholarship_id)


# ==========================================
# Admin CMS Routes
# ==========================================

@router.post(
    "",
    response_model=ScholarshipRead,
    status_code=status.HTTP_201_CREATED,
    summary="Admin: Create a new scholarship",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_create_scholarship(
    payload: ScholarshipCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_scholarship(db, data=payload)


@router.put(
    "/{scholarship_id}",
    response_model=ScholarshipRead,
    summary="Admin: Update an existing scholarship",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_update_scholarship(
    scholarship_id: int,
    payload: ScholarshipUpdate,
    db: AsyncSession = Depends(get_db),
):
    s = await update_scholarship(db, scholarship_id=scholarship_id, data=payload)
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found")
    return s


@router.delete(
    "/{scholarship_id}",
    summary="Admin: Delete a scholarship",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_delete_scholarship(
    scholarship_id: int,
    db: AsyncSession = Depends(get_db),
):
    success = await delete_scholarship(db, scholarship_id=scholarship_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found")
    return {"message": "Scholarship deleted successfully"}
