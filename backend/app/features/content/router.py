from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.core.constants import UserRole
from app.features.users.models import User
from app.features.content.schemas import (
    CountryRead,
    CountryCreate,
    CountryUpdate,
    CountryDetail,
    PostRead,
    PostCreate,
    PostUpdate,
)
from app.features.content.service import (
    get_active_countries,
    get_country_by_slug,
    create_country,
    get_all_countries_for_admin,
    update_country,
    delete_country,
    get_published_posts,
    get_post_by_slug,
    get_all_posts_for_admin,
    create_post,
    update_post,
    delete_post,
)

router = APIRouter(prefix="/content", tags=["Content & Country Guides"])


# ==========================================
# Public Routes
# ==========================================

@router.get("/countries", response_model=List[CountryRead], summary="List all active study destinations")
async def list_countries(db: AsyncSession = Depends(get_db)):
    return await get_active_countries(db)


@router.get("/countries/{slug}", response_model=CountryDetail, summary="Get destination country overview & published articles")
async def get_country(slug: str, db: AsyncSession = Depends(get_db)):
    return await get_country_by_slug(db, slug)


@router.get("/posts", response_model=List[PostRead], summary="List published educational articles and guides")
async def list_posts(
    country: Optional[str] = Query(None, description="Filter by destination country slug (e.g. 'uk', 'germany')"),
    category: Optional[str] = Query(None, description="Filter by topic/category"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    return await get_published_posts(db, country_slug=country, category=category, limit=limit, offset=offset)


@router.get("/posts/{slug}", response_model=PostRead, summary="Read a single educational article by slug")
async def read_post(slug: str, db: AsyncSession = Depends(get_db)):
    return await get_post_by_slug(db, slug, increment_views=True)


# ==========================================
# Admin Protected Routes (CMS)
# ==========================================

@router.get(
    "/admin/posts",
    response_model=List[PostRead],
    summary="Admin CMS: List all articles including drafts",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_list_posts(db: AsyncSession = Depends(get_db)):
    return await get_all_posts_for_admin(db)


@router.post(
    "/posts",
    response_model=PostRead,
    status_code=status.HTTP_201_CREATED,
    summary="Admin CMS: Publish a new educational guide or article",
)
async def admin_create_post(
    payload: PostCreate,
    current_admin: User = Depends(require_role([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db),
):
    return await create_post(db, author_id=current_admin.id, data=payload)


@router.put(
    "/posts/{post_id}",
    response_model=PostRead,
    summary="Admin CMS: Edit an existing guide or article",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_update_post(
    post_id: int,
    payload: PostUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await update_post(db, post_id=post_id, data=payload)


@router.delete(
    "/posts/{post_id}",
    summary="Admin CMS: Delete a guide or article",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await delete_post(db, post_id=post_id)


@router.get(
    "/admin/countries",
    response_model=List[CountryRead],
    summary="Admin CMS: List all study destinations (including inactive)",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_list_countries(db: AsyncSession = Depends(get_db)):
    return await get_all_countries_for_admin(db)


@router.post(
    "/countries",
    response_model=CountryRead,
    status_code=status.HTTP_201_CREATED,
    summary="Admin CMS: Add a new destination country",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_create_country(
    payload: CountryCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_country(db, data=payload)


@router.put(
    "/countries/{country_id}",
    response_model=CountryRead,
    summary="Admin CMS: Update destination country information",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_update_country(
    country_id: int,
    payload: CountryUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await update_country(db, country_id=country_id, data=payload)


@router.delete(
    "/countries/{country_id}",
    summary="Admin CMS: Delete a destination country",
    dependencies=[Depends(require_role([UserRole.ADMIN]))],
)
async def admin_delete_country(
    country_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await delete_country(db, country_id=country_id)
