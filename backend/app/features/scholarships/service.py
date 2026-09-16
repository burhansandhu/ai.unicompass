import re
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, delete
from sqlalchemy.orm import selectinload
from app.features.scholarships.models import Scholarship, SavedScholarship
from app.features.scholarships.schemas import (
    ScholarshipCreate,
    ScholarshipUpdate,
    ScholarshipRead,
    ScholarshipToggleResponse,
    SavedScholarshipItem,
)
from app.features.content.models import Country


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "-", text)


def build_scholarship_read(
    s: Scholarship,
    is_saved: bool = False,
) -> ScholarshipRead:
    c_name = s.country.name if s.country else "International / Multi-Country"
    c_flag = s.country.flag_emoji if s.country else "🌍"
    c_slug = s.country.slug if s.country else None

    return ScholarshipRead(
        id=s.id,
        title=s.title,
        slug=s.slug,
        provider=s.provider,
        country_id=s.country_id,
        degree_level=s.degree_level,
        coverage_type=s.coverage_type,
        amount_value=s.amount_value,
        deadline_date=s.deadline_date,
        eligibility_criteria=s.eligibility_criteria,
        application_link=s.application_link,
        description=s.description,
        is_active=s.is_active,
        country_name=c_name,
        country_flag_emoji=c_flag,
        country_slug=c_slug,
        is_saved=is_saved,
        created_at=s.created_at,
        updated_at=s.updated_at,
    )


async def filter_scholarships(
    session: AsyncSession,
    search: Optional[str] = None,
    country_slug: Optional[str] = None,
    degree_level: Optional[str] = None,
    coverage_type: Optional[str] = None,
    user_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[ScholarshipRead]:
    query = (
        select(Scholarship)
        .outerjoin(Country, Scholarship.country_id == Country.id)
        .where(Scholarship.is_active == True)
        .options(selectinload(Scholarship.country))
    )

    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            or_(
                Scholarship.title.ilike(term),
                Scholarship.provider.ilike(term),
                Scholarship.description.ilike(term),
                Country.name.ilike(term),
            )
        )

    if country_slug:
        query = query.where(Country.slug == country_slug)

    if degree_level and degree_level.lower() != "all":
        query = query.where(
            or_(
                Scholarship.degree_level.ilike(f"%{degree_level}%"),
                Scholarship.degree_level == "All Levels",
            )
        )

    if coverage_type and coverage_type.lower() != "all":
        query = query.where(Scholarship.coverage_type.ilike(f"%{coverage_type}%"))

    query = query.order_by(Scholarship.created_at.desc()).limit(limit).offset(offset)
    res = await session.execute(query)
    scholarships = res.scalars().all()

    # Get user's saved scholarship IDs
    saved_ids = set()
    if user_id:
        s_res = await session.execute(
            select(SavedScholarship.scholarship_id).where(SavedScholarship.user_id == user_id)
        )
        saved_ids = set(s_res.scalars().all())

    return [build_scholarship_read(s, is_saved=(s.id in saved_ids)) for s in scholarships]


async def get_scholarship_by_id_or_slug(
    session: AsyncSession,
    id_or_slug: str,
    user_id: Optional[int] = None,
) -> Optional[ScholarshipRead]:
    query = select(Scholarship).options(selectinload(Scholarship.country))
    if id_or_slug.isdigit():
        query = query.where(Scholarship.id == int(id_or_slug))
    else:
        query = query.where(Scholarship.slug == id_or_slug)

    res = await session.execute(query)
    s = res.scalar_one_or_none()
    if not s:
        return None

    is_saved = False
    if user_id:
        s_res = await session.execute(
            select(SavedScholarship.id).where(
                SavedScholarship.user_id == user_id,
                SavedScholarship.scholarship_id == s.id,
            )
        )
        is_saved = s_res.scalar_one_or_none() is not None

    return build_scholarship_read(s, is_saved=is_saved)


async def create_scholarship(
    session: AsyncSession,
    data: ScholarshipCreate,
) -> ScholarshipRead:
    slug = data.slug or slugify(data.title)
    # Ensure uniqueness of slug
    existing = await session.execute(select(Scholarship.id).where(Scholarship.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{int(datetime.now().timestamp())}"

    s = Scholarship(
        title=data.title,
        slug=slug,
        provider=data.provider,
        country_id=data.country_id,
        degree_level=data.degree_level,
        coverage_type=data.coverage_type,
        amount_value=data.amount_value,
        deadline_date=data.deadline_date,
        eligibility_criteria=data.eligibility_criteria,
        application_link=data.application_link,
        description=data.description,
        is_active=data.is_active,
    )
    session.add(s)
    await session.commit()
    await session.refresh(s)

    # Reload with country
    res = await session.execute(
        select(Scholarship).where(Scholarship.id == s.id).options(selectinload(Scholarship.country))
    )
    reloaded = res.scalar_one()
    return build_scholarship_read(reloaded, is_saved=False)


async def update_scholarship(
    session: AsyncSession,
    scholarship_id: int,
    data: ScholarshipUpdate,
) -> Optional[ScholarshipRead]:
    res = await session.execute(
        select(Scholarship).where(Scholarship.id == scholarship_id).options(selectinload(Scholarship.country))
    )
    s = res.scalar_one_or_none()
    if not s:
        return None

    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(s, field, val)

    await session.commit()
    await session.refresh(s)
    return build_scholarship_read(s, is_saved=False)


async def delete_scholarship(
    session: AsyncSession,
    scholarship_id: int,
) -> bool:
    res = await session.execute(select(Scholarship).where(Scholarship.id == scholarship_id))
    s = res.scalar_one_or_none()
    if not s:
        return False

    await session.delete(s)
    await session.commit()
    return True


async def toggle_save_scholarship(
    session: AsyncSession,
    user_id: int,
    scholarship_id: int,
) -> ScholarshipToggleResponse:
    res = await session.execute(
        select(SavedScholarship).where(
            SavedScholarship.user_id == user_id,
            SavedScholarship.scholarship_id == scholarship_id,
        )
    )
    saved = res.scalar_one_or_none()

    if saved:
        await session.delete(saved)
        await session.commit()
        return ScholarshipToggleResponse(
            scholarship_id=scholarship_id,
            is_saved=False,
            message="Scholarship removed from saved list.",
        )
    else:
        new_saved = SavedScholarship(user_id=user_id, scholarship_id=scholarship_id)
        session.add(new_saved)
        await session.commit()
        return ScholarshipToggleResponse(
            scholarship_id=scholarship_id,
            is_saved=True,
            message="Scholarship saved to your student dashboard!",
        )


async def get_student_saved_scholarships(
    session: AsyncSession,
    user_id: int,
) -> List[SavedScholarshipItem]:
    query = (
        select(SavedScholarship, Scholarship)
        .join(Scholarship, SavedScholarship.scholarship_id == Scholarship.id)
        .options(selectinload(Scholarship.country))
        .where(SavedScholarship.user_id == user_id)
        .order_by(SavedScholarship.created_at.desc())
    )
    res = await session.execute(query)
    rows = res.all()

    items = []
    for saved, s in rows:
        read = build_scholarship_read(s, is_saved=True)
        items.append(
            SavedScholarshipItem(
                id=saved.id,
                scholarship_id=s.id,
                scholarship=read,
                created_at=saved.created_at,
            )
        )
    return items


async def seed_scholarships_if_empty(session: AsyncSession) -> None:
    res = await session.execute(select(Scholarship.id).limit(1))
    if res.scalar_one_or_none():
        return

    print("[UniCompass] Seeding top international scholarships for Pakistani students...")
    # Fetch country ids
    ctry_res = await session.execute(select(Country.id, Country.slug))
    country_map = {slug: cid for cid, slug in ctry_res.all()}

    seeds = [
        {
            "title": "DAAD Helmut-Schmidt Programme (Master's in Public Policy & Good Governance)",
            "slug": "daad-helmut-schmidt-programme-germany",
            "provider": "German Academic Exchange Service (DAAD)",
            "country_id": country_map.get("germany"),
            "degree_level": "Masters",
            "coverage_type": "Fully Funded",
            "amount_value": "100% Tuition + €934/month stipend + Health Insurance + Travel Allowance",
            "deadline_date": "31 Jul 2027",
            "eligibility_criteria": "Bachelor's degree with minimum 3.0/4.0 CGPA, Pakistani citizenship, English proficiency (MOI accepted by select partner universities, IELTS 6.5 recommended).",
            "application_link": "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
            "description": "Prestigious German scholarship designed for future leaders from developing nations in economics, political science, law, and social sciences.",
            "is_active": True,
        },
        {
            "title": "Chevening Scholarship UK (One-Year Master's Degree)",
            "slug": "chevening-scholarship-uk",
            "provider": "UK Foreign, Commonwealth & Development Office (FCDO)",
            "country_id": country_map.get("uk") or country_map.get("united-kingdom"),
            "degree_level": "Masters",
            "coverage_type": "Fully Funded",
            "amount_value": "Full University Tuition + Monthly Living Allowance (£1,300+ in London, £1,050+ outside) + Return Flights",
            "deadline_date": "05 Nov 2026",
            "eligibility_criteria": "Undergraduate degree equivalent to UK 2:1 honours, at least two years (2,800 hours) of work experience, return to Pakistan for at least 2 years upon completion.",
            "application_link": "https://www.chevening.org/scholarship/pakistan/",
            "description": "The UK government's premier global scholarship scheme, giving proven emerging leaders the opportunity to pursue any one-year master's degree at any accredited UK university.",
            "is_active": True,
        },
        {
            "title": "Erasmus Mundus Joint Master Degrees (EMJM)",
            "slug": "erasmus-mundus-joint-masters-europe",
            "provider": "European Commission",
            "country_id": None,  # Multi-country European
            "degree_level": "Masters",
            "coverage_type": "Fully Funded",
            "amount_value": "100% Tuition Waiver + €1,400/month living allowance + Comprehensive Insurance + Travel Grants",
            "deadline_date": "15 Jan 2027",
            "eligibility_criteria": "High academic standing (typically 3.2+ CGPA), study across at least 2 to 3 European countries, open to all Pakistani bachelor graduates with no age limit.",
            "application_link": "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters",
            "description": "Prestigious international study programmes, jointly designed and delivered by an international consortium of European higher education institutions.",
            "is_active": True,
        },
        {
            "title": "Commonwealth Master's & PhD Scholarships",
            "slug": "commonwealth-scholarships-uk",
            "provider": "Commonwealth Scholarship Commission (CSC)",
            "country_id": country_map.get("uk") or country_map.get("united-kingdom"),
            "degree_level": "Masters",
            "coverage_type": "Fully Funded",
            "amount_value": "Approved Airfare + Full Tuition Fees + Stipend of £1,347/month (£1,652 in London)",
            "deadline_date": "12 Dec 2026",
            "eligibility_criteria": "Pakistani citizen, unable to afford study in the UK without scholarship, minimum 16 years of education (first class / 3.0+ CGPA), nominated via HEC Pakistan.",
            "application_link": "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
            "description": "Funded by the UK FCDO for talented and motivated individuals from the Commonwealth to gain skills needed for sustainable development.",
            "is_active": True,
        },
        {
            "title": "Australia Awards Scholarships",
            "slug": "australia-awards-scholarships-pakistan",
            "provider": "Australian Department of Foreign Affairs and Trade (DFAT)",
            "country_id": country_map.get("australia"),
            "degree_level": "Masters",
            "coverage_type": "Fully Funded",
            "amount_value": "Full Tuition + Return Airfare + Establishment Allowance + Contribution to Living Expenses (A$30,000/yr)",
            "deadline_date": "30 Apr 2027",
            "eligibility_criteria": "Pakistani citizen, minimum 2 years of work experience in development, public health, energy, or education, IELTS 6.5 (minimum 6.0 in each subtest).",
            "application_link": "https://www.dfat.gov.au/people-to-people/australia-awards",
            "description": "Long-term awards that provide opportunities for Pakistani professionals to undertake full-time postgraduate study at participating Australian universities.",
            "is_active": True,
        },
        {
            "title": "Eiffel Excellence Scholarship Programme",
            "slug": "eiffel-excellence-scholarship-france",
            "provider": "French Ministry for Europe and Foreign Affairs",
            "country_id": country_map.get("france"),
            "degree_level": "Masters",
            "coverage_type": "Fully Funded",
            "amount_value": "Monthly Allowance of €1,181 + International Transport + Social Security + Cultural Activities",
            "deadline_date": "10 Jan 2027",
            "eligibility_criteria": "Up to 25 years old for Master level, top academic ranking, submitted directly by the French higher education institution on behalf of the candidate.",
            "application_link": "https://www.campusfrance.org/en/the-eiffel-scholarship-program",
            "description": "Enables French higher education institutions to attract top foreign students for master's and PhD degree programs in engineering, law, economics, and political science.",
            "is_active": True,
        },
    ]

    for seed in seeds:
        s = Scholarship(**seed)
        session.add(s)

    await session.commit()
    print("[UniCompass] Seeded 6 premier international scholarships successfully.")
