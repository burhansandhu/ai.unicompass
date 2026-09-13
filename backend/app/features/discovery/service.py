from datetime import datetime, timezone
from typing import List, Optional, Tuple, Dict
from sqlalchemy import select, delete, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.content.models import Country
from app.features.discovery.models import University, Program, ShortlistedProgram
from app.features.discovery.schemas import (
    ProgramRead,
    UniversityRead,
    ShortlistedProgramItem,
    ShortlistToggleResponse,
)
from app.features.profiles.models import StudentProfile


# Fallback exchange rates and monthly living expense estimates in PKR
EXCHANGE_RATES_PKR: Dict[str, float] = {
    "GBP": 365.0,
    "EUR": 305.0,
    "CAD": 208.0,
    "AUD": 185.0,
    "USD": 280.0,
}

MONTHLY_LIVING_PKR: Dict[str, float] = {
    "UK": 320000.0,
    "Germany": 280000.0,
    "Canada": 260000.0,
    "Australia": 270000.0,
    "USA": 330000.0,
    "France": 250000.0,
}


def build_program_read(
    program: Program,
    country: Country,
    university: University,
    is_shortlisted: bool = False,
    student_profile: Optional[StudentProfile] = None,
) -> ProgramRead:
    currency = program.currency_code.upper()
    rate = EXCHANGE_RATES_PKR.get(currency, 280.0)

    # 1. Real-time PKR Calculations
    tuition_pkr = round(program.annual_tuition_original * rate, 2)
    monthly_living = MONTHLY_LIVING_PKR.get(country.name, 280000.0)
    annual_living_pkr = round(monthly_living * 12, 2)
    total_cost_pkr = round(tuition_pkr + annual_living_pkr, 2)

    # 2. MOI Waiver Eligibility
    # If program or university explicitly accepts MOI
    moi_eligible = program.accepts_moi or university.accepts_moi_waiver

    # 3. Profile-Based Matching
    match_status = None
    match_reason = None

    if student_profile:
        reasons = []
        is_cgpa_met = True
        is_budget_met = True
        is_english_met = True

        # CGPA Check
        if student_profile.cgpa is not None:
            if student_profile.cgpa >= program.min_cgpa:
                reasons.append(f"CGPA {student_profile.cgpa} meets requirement of {program.min_cgpa}")
            elif student_profile.cgpa >= (program.min_cgpa - 0.2):
                is_cgpa_met = False
                reasons.append(f"Competitive: CGPA {student_profile.cgpa} is close to {program.min_cgpa}")
            else:
                is_cgpa_met = False
                reasons.append(f"Stretch: Requires CGPA {program.min_cgpa}")

        # Budget Check
        if student_profile.max_annual_budget_pkr:
            if student_profile.max_annual_budget_pkr >= total_cost_pkr:
                reasons.append("Within your stated annual budget in PKR")
            elif student_profile.max_annual_budget_pkr >= (total_cost_pkr * 0.75):
                is_budget_met = False
                reasons.append("Slightly above budget (scholarship recommended)")
            else:
                is_budget_met = False
                reasons.append("Above budget in PKR")

        # English / MOI Check
        if student_profile.moi_waiver_eligible and moi_eligible:
            reasons.append("Eligible for MOI English Waiver (No IELTS required!)")
        elif student_profile.english_overall_score and program.min_ielts_score:
            if student_profile.english_overall_score >= program.min_ielts_score:
                reasons.append(f"English score {student_profile.english_overall_score} meets required {program.min_ielts_score}")
            else:
                is_english_met = False

        if is_cgpa_met and is_budget_met:
            match_status = "eligible"
        elif is_cgpa_met or is_budget_met:
            match_status = "competitive"
        else:
            match_status = "stretch"

        match_reason = " • ".join(reasons) if reasons else "Based on your academic profile"

    return ProgramRead(
        id=program.id,
        university_id=university.id,
        university_name=university.name,
        university_city=university.city,
        university_logo_url=university.logo_url,
        university_world_ranking=university.world_ranking,
        country_id=country.id,
        country_name=country.name,
        country_code=country.code,
        country_flag_emoji=country.flag_emoji,
        name=program.name,
        slug=program.slug,
        degree_level=program.degree_level,
        discipline=program.discipline,
        duration_years=program.duration_years,
        intake_seasons=program.intake_seasons,
        min_cgpa=program.min_cgpa,
        min_cgpa_scale=program.min_cgpa_scale,
        annual_tuition_original=program.annual_tuition_original,
        currency_code=program.currency_code,
        currency_symbol=program.currency_symbol,
        annual_tuition_pkr=tuition_pkr,
        annual_living_cost_pkr=annual_living_pkr,
        total_annual_cost_pkr=total_cost_pkr,
        min_ielts_score=program.min_ielts_score,
        min_pte_score=program.min_pte_score,
        accepts_moi=program.accepts_moi or university.accepts_moi_waiver,
        moi_waiver_eligible=moi_eligible,
        moi_conditions=university.moi_conditions,
        application_deadline_fall=program.application_deadline_fall,
        application_deadline_spring=program.application_deadline_spring,
        description=program.description,
        is_active=program.is_active,
        is_shortlisted=is_shortlisted,
        match_status=match_status,
        match_reason=match_reason,
    )


async def get_all_universities(session: AsyncSession) -> List[UniversityRead]:
    query = (
        select(University)
        .options(selectinload(University.country), selectinload(University.programs))
        .where(University.is_active == True)
        .order_by(University.world_ranking.asc().nulls_last())
    )
    res = await session.execute(query)
    universities = res.scalars().all()

    output = []
    for u in universities:
        output.append(
            UniversityRead(
                id=u.id,
                name=u.name,
                slug=u.slug,
                city=u.city,
                world_ranking=u.world_ranking,
                logo_url=u.logo_url,
                cover_image_url=u.cover_image_url,
                website_url=u.website_url,
                accepts_moi_waiver=u.accepts_moi_waiver,
                moi_conditions=u.moi_conditions,
                is_active=u.is_active,
                country_id=u.country_id,
                country_name=u.country.name if u.country else "",
                country_code=u.country.code if u.country else "",
                country_flag_emoji=u.country.flag_emoji if u.country else "",
                programs_count=len(u.programs),
            )
        )
    return output


async def filter_programs(
    session: AsyncSession,
    search: Optional[str] = None,
    country_slug: Optional[str] = None,
    degree_level: Optional[str] = None,
    discipline: Optional[str] = None,
    max_budget_pkr: Optional[float] = None,
    moi_only: Optional[bool] = None,
    user_id: Optional[int] = None,
    student_profile: Optional[StudentProfile] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[ProgramRead]:
    query = (
        select(Program, University, Country)
        .join(University, Program.university_id == University.id)
        .join(Country, University.country_id == Country.id)
        .where(Program.is_active == True, University.is_active == True)
    )

    if search:
        search_fmt = f"%{search.strip().lower()}%"
        query = query.where(
            or_(
                func.lower(Program.name).like(search_fmt),
                func.lower(University.name).like(search_fmt),
                func.lower(Program.discipline).like(search_fmt),
            )
        )

    if country_slug:
        query = query.where(Country.slug == country_slug)

    if degree_level:
        query = query.where(func.lower(Program.degree_level) == degree_level.strip().lower())

    if discipline:
        query = query.where(func.lower(Program.discipline) == discipline.strip().lower())

    if moi_only:
        query = query.where(or_(Program.accepts_moi == True, University.accepts_moi_waiver == True))

    query = query.order_by(Program.id.asc()).offset(offset).limit(limit)

    result = await session.execute(query)
    rows = result.all()

    # Get user shortlisted program IDs if logged in
    shortlisted_ids = set()
    if user_id:
        sh_res = await session.execute(
            select(ShortlistedProgram.program_id).where(ShortlistedProgram.user_id == user_id)
        )
        shortlisted_ids = set(sh_res.scalars().all())

    programs_read = []
    for prog, uni, ctry in rows:
        is_sh = prog.id in shortlisted_ids
        read_obj = build_program_read(prog, ctry, uni, is_shortlisted=is_sh, student_profile=student_profile)

        # Budget post-filter in PKR if specified
        if max_budget_pkr is not None and read_obj.total_annual_cost_pkr > max_budget_pkr:
            continue

        programs_read.append(read_obj)

    return programs_read


async def toggle_shortlist_program(
    session: AsyncSession, user_id: int, program_id: int
) -> ShortlistToggleResponse:
    res = await session.execute(
        select(ShortlistedProgram).where(
            ShortlistedProgram.user_id == user_id,
            ShortlistedProgram.program_id == program_id,
        )
    )
    existing = res.scalar_one_or_none()

    if existing:
        await session.delete(existing)
        await session.commit()
        return ShortlistToggleResponse(
            shortlisted=False,
            program_id=program_id,
            message="Program removed from your shortlist.",
        )
    else:
        new_item = ShortlistedProgram(user_id=user_id, program_id=program_id)
        session.add(new_item)
        await session.commit()
        return ShortlistToggleResponse(
            shortlisted=True,
            program_id=program_id,
            message="Program saved to your shortlisted universities.",
        )


async def get_student_shortlist(session: AsyncSession, user_id: int) -> List[ShortlistedProgramItem]:
    query = (
        select(ShortlistedProgram, Program, University, Country)
        .join(Program, ShortlistedProgram.program_id == Program.id)
        .join(University, Program.university_id == University.id)
        .join(Country, University.country_id == Country.id)
        .where(ShortlistedProgram.user_id == user_id)
        .order_by(ShortlistedProgram.created_at.desc())
    )
    res = await session.execute(query)
    rows = res.all()

    items = []
    for sh, prog, uni, ctry in rows:
        prog_read = build_program_read(prog, ctry, uni, is_shortlisted=True)
        items.append(
            ShortlistedProgramItem(
                id=sh.id,
                program_id=prog.id,
                notes=sh.notes,
                created_at=sh.created_at,
                program=prog_read,
            )
        )
    return items


async def seed_discovery_data_if_empty(session: AsyncSession):
    # Check if universities already exist
    uni_count_res = await session.execute(select(func.count(University.id)))
    if (uni_count_res.scalar_one_or_none() or 0) > 0:
        return

    # Fetch country IDs
    c_res = await session.execute(select(Country))
    countries = {c.code.upper(): c for c in c_res.scalars().all()}
    if not countries:
        return

    # Seed Universities
    uk = countries.get("GB") or countries.get("UK")
    de = countries.get("DE")
    ca = countries.get("CA")
    au = countries.get("AU")
    us = countries.get("US")
    fr = countries.get("FR")

    universities_to_seed = []

    # 1. Technical University of Munich (Germany) - Tuition Free!
    if de:
        universities_to_seed.append(
            {
                "country": de,
                "name": "Technical University of Munich (TUM)",
                "slug": "technical-university-of-munich",
                "city": "Munich",
                "world_ranking": 28,
                "logo_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop",
                "website_url": "https://www.tum.de",
                "accepts_moi_waiver": False,
                "moi_conditions": "Select faculties accept MOI with German language A1 certificate; IELTS 6.5 recommended.",
                "programs": [
                    {
                        "name": "MSc Data Engineering and Analytics",
                        "slug": "tum-msc-data-engineering",
                        "degree_level": "Masters",
                        "discipline": "Computer Science & IT",
                        "duration_years": 2.0,
                        "intake_seasons": ["Winter", "Summer"],
                        "min_cgpa": 3.2,
                        "annual_tuition_original": 0.0,
                        "currency_code": "EUR",
                        "currency_symbol": "€",
                        "min_ielts_score": 6.5,
                        "accepts_moi": False,
                        "application_deadline_fall": "31 May 2027",
                        "application_deadline_spring": "15 Jan 2027",
                        "description": "Tuition-free world-class Master's in Munich focusing on big data pipelines and machine learning.",
                    },
                    {
                        "name": "MSc Automotive Engineering",
                        "slug": "tum-msc-automotive",
                        "degree_level": "Masters",
                        "discipline": "Engineering",
                        "duration_years": 2.0,
                        "intake_seasons": ["Winter"],
                        "min_cgpa": 3.0,
                        "annual_tuition_original": 0.0,
                        "currency_code": "EUR",
                        "currency_symbol": "€",
                        "min_ielts_score": 6.5,
                        "accepts_moi": False,
                        "application_deadline_fall": "31 May 2027",
                        "application_deadline_spring": None,
                        "description": "Zero tuition public German engineering Master's closely linked with BMW and Audi industry hubs.",
                    },
                ],
            }
        )

    # 2. Coventry University (UK) - Accepts Pakistani MOI Waiver!
    if uk:
        universities_to_seed.append(
            {
                "country": uk,
                "name": "Coventry University",
                "slug": "coventry-university",
                "city": "Coventry & London",
                "world_ranking": 551,
                "logo_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&auto=format&fit=crop",
                "website_url": "https://www.coventry.ac.uk",
                "accepts_moi_waiver": True,
                "moi_conditions": "Accepts Medium of Instruction (MOI) English waiver from HEC-recognized Pakistani universities with min 60% marks.",
                "programs": [
                    {
                        "name": "MSc Artificial Intelligence and Human Factors",
                        "slug": "coventry-msc-ai",
                        "degree_level": "Masters",
                        "discipline": "Computer Science & IT",
                        "duration_years": 1.0,
                        "intake_seasons": ["Fall", "Spring", "Summer"],
                        "min_cgpa": 2.6,
                        "annual_tuition_original": 16900.0,
                        "currency_code": "GBP",
                        "currency_symbol": "£",
                        "min_ielts_score": 6.5,
                        "accepts_moi": True,
                        "application_deadline_fall": "15 Jul 2027",
                        "application_deadline_spring": "15 Nov 2026",
                        "description": "High-demand AI program offering MOI English waiver for Pakistani graduates and optional 1-year work placement.",
                    },
                    {
                        "name": "MBA International Business Management",
                        "slug": "coventry-mba-international",
                        "degree_level": "Masters",
                        "discipline": "Business & Management",
                        "duration_years": 1.0,
                        "intake_seasons": ["Fall", "Spring"],
                        "min_cgpa": 2.5,
                        "annual_tuition_original": 18200.0,
                        "currency_code": "GBP",
                        "currency_symbol": "£",
                        "min_ielts_score": 6.5,
                        "accepts_moi": True,
                        "application_deadline_fall": "15 Jul 2027",
                        "application_deadline_spring": "15 Nov 2026",
                        "description": "AMBA accredited MBA in central London with no IELTS required when presenting an official Pakistani university MOI letter.",
                    },
                ],
            }
        )

    # 3. University of Oxford (UK) - Top Tier
    if uk:
        universities_to_seed.append(
            {
                "country": uk,
                "name": "University of Oxford",
                "slug": "university-of-oxford",
                "city": "Oxford",
                "world_ranking": 3,
                "logo_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop",
                "website_url": "https://www.ox.ac.uk",
                "accepts_moi_waiver": False,
                "moi_conditions": "Strict IELTS 7.5 requirement. Standard Rhodes and Clarendon scholarships available for Pakistani applicants.",
                "programs": [
                    {
                        "name": "MSc in Advanced Computer Science",
                        "slug": "oxford-msc-advanced-cs",
                        "degree_level": "Masters",
                        "discipline": "Computer Science & IT",
                        "duration_years": 1.0,
                        "intake_seasons": ["Fall"],
                        "min_cgpa": 3.7,
                        "annual_tuition_original": 34920.0,
                        "currency_code": "GBP",
                        "currency_symbol": "£",
                        "min_ielts_score": 7.5,
                        "accepts_moi": False,
                        "application_deadline_fall": "28 Feb 2027",
                        "application_deadline_spring": None,
                        "description": "Premier graduate degree in computation, algorithms, and automated verification with full scholarship eligibility.",
                    }
                ],
            }
        )

    # 4. University of Toronto (Canada)
    if ca:
        universities_to_seed.append(
            {
                "country": ca,
                "name": "University of Toronto",
                "slug": "university-of-toronto",
                "city": "Toronto",
                "world_ranking": 21,
                "logo_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=200&auto=format&fit=crop",
                "website_url": "https://www.utoronto.ca",
                "accepts_moi_waiver": False,
                "moi_conditions": "Requires IELTS 7.0 or Duolingo 120. Student Direct Stream (SDS) visa processing supported.",
                "programs": [
                    {
                        "name": "Master of Science in Applied Computing (MScAC)",
                        "slug": "utoronto-mscac",
                        "degree_level": "Masters",
                        "discipline": "Computer Science & IT",
                        "duration_years": 1.5,
                        "intake_seasons": ["Fall"],
                        "min_cgpa": 3.3,
                        "annual_tuition_original": 38000.0,
                        "currency_code": "CAD",
                        "currency_symbol": "C$",
                        "min_ielts_score": 7.0,
                        "accepts_moi": False,
                        "application_deadline_fall": "15 Jan 2027",
                        "application_deadline_spring": None,
                        "description": "Canada's top applied computer science program including an 8-month paid industrial internship in Toronto's tech corridor.",
                    }
                ],
            }
        )

    # 5. University of Melbourne (Australia)
    if au:
        universities_to_seed.append(
            {
                "country": au,
                "name": "University of Melbourne",
                "slug": "university-of-melbourne",
                "city": "Melbourne",
                "world_ranking": 14,
                "logo_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop",
                "website_url": "https://www.unimelb.edu.au",
                "accepts_moi_waiver": False,
                "moi_conditions": "Requires IELTS 6.5 or PTE 58. Post-study work rights up to 4 years for regional and Melbourne graduates.",
                "programs": [
                    {
                        "name": "Master of Information Technology",
                        "slug": "unimelb-master-it",
                        "degree_level": "Masters",
                        "discipline": "Computer Science & IT",
                        "duration_years": 2.0,
                        "intake_seasons": ["Semester 1 (Feb)", "Semester 2 (Jul)"],
                        "min_cgpa": 3.0,
                        "annual_tuition_original": 46500.0,
                        "currency_code": "AUD",
                        "currency_symbol": "A$",
                        "min_ielts_score": 6.5,
                        "accepts_moi": False,
                        "application_deadline_fall": "31 Oct 2026",
                        "application_deadline_spring": "30 Apr 2027",
                        "description": "ACS accredited flagship Australian IT program offering cybersecurity and artificial intelligence tracks.",
                    }
                ],
            }
        )

    # Commit all seeds
    for u_data in universities_to_seed:
        programs_data = u_data.pop("programs")
        country_obj = u_data.pop("country")

        uni = University(**u_data, country_id=country_obj.id)
        session.add(uni)
        await session.flush()

        for p_data in programs_data:
            prog = Program(**p_data, university_id=uni.id)
            session.add(prog)

    await session.commit()
    print(f"[UniCompass] Seeded {len(universities_to_seed)} universities with programs.")
