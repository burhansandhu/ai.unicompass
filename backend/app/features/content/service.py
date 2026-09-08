import re
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from app.features.content.models import Country, Post
from app.features.content.schemas import CountryCreate, CountryUpdate, PostCreate, PostUpdate


def slugify(text: str) -> str:
    """Transform string to SEO-friendly URL slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text or "article"


async def generate_unique_post_slug(db: AsyncSession, title: str, current_id: Optional[int] = None) -> str:
    base_slug = slugify(title)
    slug = base_slug
    counter = 1

    while True:
        query = select(Post).where(Post.slug == slug)
        if current_id:
            query = query.where(Post.id != current_id)
        result = await db.execute(query)
        if not result.scalar_one_or_none():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


async def generate_unique_country_slug(db: AsyncSession, name: str, current_id: Optional[int] = None) -> str:
    base_slug = slugify(name)
    slug = base_slug
    counter = 1

    while True:
        query = select(Country).where(Country.slug == slug)
        if current_id:
            query = query.where(Country.id != current_id)
        result = await db.execute(query)
        if not result.scalar_one_or_none():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


# --- Country Services ---

async def get_active_countries(db: AsyncSession) -> List[Country]:
    query = select(Country).where(Country.is_active == True).order_by(Country.name)
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_country_by_slug(db: AsyncSession, slug: str) -> Country:
    query = (
        select(Country)
        .where(Country.slug == slug.lower())
        .options(
            selectinload(Country.posts.and_(Post.is_published == True))
            .selectinload(Post.author)
        )
    )
    result = await db.execute(query)
    country = result.scalar_one_or_none()
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destination country '{slug}' not found.",
        )
    return country


async def create_country(db: AsyncSession, data: CountryCreate) -> Country:
    slug = data.slug or await generate_unique_country_slug(db, data.name)
    country = Country(
        name=data.name.strip(),
        code=data.code.upper().strip(),
        slug=slug,
        flag_emoji=data.flag_emoji,
        overview=data.overview,
        currency=data.currency.upper().strip(),
        avg_cost_pkr=data.avg_cost_pkr,
        work_hours_per_week=data.work_hours_per_week or "20 hrs / week",
        post_study_work_visa=data.post_study_work_visa or "18 - 36 Months",
        hero_image_url=data.hero_image_url,
        popular_tag=data.popular_tag,
        is_active=data.is_active,
    )
    db.add(country)
    await db.commit()
    await db.refresh(country)
    return country


async def get_all_countries_for_admin(db: AsyncSession) -> List[Country]:
    query = select(Country).order_by(Country.name)
    result = await db.execute(query)
    return list(result.scalars().all())


async def update_country(db: AsyncSession, country_id: int, data: CountryUpdate) -> Country:
    country = await db.get(Country, country_id)
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Country with ID {country_id} not found.",
        )

    update_dict = data.model_dump(exclude_unset=True)
    if "name" in update_dict and update_dict["name"] != country.name and "slug" not in update_dict:
        update_dict["slug"] = await generate_unique_country_slug(db, update_dict["name"], current_id=country_id)
    elif "slug" in update_dict and update_dict["slug"]:
        update_dict["slug"] = await generate_unique_country_slug(db, update_dict["slug"], current_id=country_id)

    if "code" in update_dict and update_dict["code"]:
        update_dict["code"] = update_dict["code"].upper().strip()

    if "currency" in update_dict and update_dict["currency"]:
        update_dict["currency"] = update_dict["currency"].upper().strip()

    for key, value in update_dict.items():
        setattr(country, key, value)

    await db.commit()
    await db.refresh(country)
    return country


async def delete_country(db: AsyncSession, country_id: int) -> dict:
    country = await db.get(Country, country_id)
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Country with ID {country_id} not found.",
        )
    await db.delete(country)
    await db.commit()
    return {"message": f"Country '{country.name}' deleted successfully."}


# --- Post Services ---

async def get_published_posts(
    db: AsyncSession,
    country_slug: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
) -> List[Post]:
    query = (
        select(Post)
        .where(Post.is_published == True)
        .options(selectinload(Post.country), selectinload(Post.author))
        .order_by(desc(Post.created_at))
        .limit(limit)
        .offset(offset)
    )
    if country_slug:
        query = query.join(Post.country).where(Country.slug == country_slug.lower())
    if category:
        query = query.where(Post.category.ilike(f"%{category}%"))

    result = await db.execute(query)
    return list(result.scalars().all())


async def get_post_by_slug(db: AsyncSession, slug: str, increment_views: bool = True) -> Post:
    query = (
        select(Post)
        .where(Post.slug == slug.lower())
        .options(selectinload(Post.country), selectinload(Post.author))
    )
    result = await db.execute(query)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article '{slug}' not found.",
        )

    if increment_views:
        post.views_count += 1
        await db.commit()
        await db.refresh(post)

    return post


async def get_all_posts_for_admin(db: AsyncSession) -> List[Post]:
    query = (
        select(Post)
        .options(selectinload(Post.country), selectinload(Post.author))
        .order_by(desc(Post.created_at))
    )
    result = await db.execute(query)
    return list(result.scalars().all())


async def create_post(db: AsyncSession, author_id: int, data: PostCreate) -> Post:
    slug = data.slug or await generate_unique_post_slug(db, data.title)

    post = Post(
        author_id=author_id,
        country_id=data.country_id,
        title=data.title.strip(),
        slug=slug,
        excerpt=data.excerpt.strip(),
        content=data.content,
        category=data.category.strip(),
        featured_image_url=data.featured_image_url,
        read_time=data.read_time,
        is_published=data.is_published,
        views_count=0,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    # Reload relationships
    return await get_post_by_slug(db, post.slug, increment_views=False)


async def update_post(db: AsyncSession, post_id: int, data: PostUpdate) -> Post:
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    update_dict = data.model_dump(exclude_unset=True)
    if "title" in update_dict and "slug" not in update_dict:
        update_dict["slug"] = await generate_unique_post_slug(db, update_dict["title"], current_id=post_id)

    for field, val in update_dict.items():
        setattr(post, field, val)

    await db.commit()
    await db.refresh(post)
    return await get_post_by_slug(db, post.slug, increment_views=False)


async def delete_post(db: AsyncSession, post_id: int) -> dict:
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    await db.delete(post)
    await db.commit()
    return {"message": "Post deleted successfully", "id": post_id}


# --- Seeding Default Data ---

async def seed_content_if_empty(db: AsyncSession, admin_user_id: Optional[int] = None):
    # Check if countries already exist
    res = await db.execute(select(Country))
    if res.scalars().first():
        return  # already seeded

    print("[UniCompass] Seeding initial countries and articles...")

    default_countries = [
        {
            "name": "United Kingdom",
            "code": "GB",
            "slug": "uk",
            "flag_emoji": "🇬🇧",
            "overview": "The UK offers world-renowned universities, 1-year Master's degrees, and a 2-year Post-Study Work Visa (Graduate Route). Over 25,000 Pakistani students study here annually.",
            "currency": "GBP",
            "avg_cost_pkr": "PKR 45 - 65 Lakhs / yr",
            "hero_image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
            "popular_tag": "1-Year Master's",
        },
        {
            "name": "Canada",
            "code": "CA",
            "slug": "canada",
            "flag_emoji": "🇨🇦",
            "overview": "Canada provides world-class research institutions, highly affordable tuition compared to the US, and generous Post-Graduation Work Permits (PGWP) leading to permanent residency.",
            "currency": "CAD",
            "avg_cost_pkr": "PKR 40 - 55 Lakhs / yr",
            "hero_image_url": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop",
            "popular_tag": "Post-Study Work",
        },
        {
            "name": "Germany",
            "code": "DE",
            "slug": "germany",
            "flag_emoji": "🇩🇪",
            "overview": "German public universities charge zero or negligible tuition fees for international students. High-demand STEM programs with an 18-month job seeker visa after graduation.",
            "currency": "EUR",
            "avg_cost_pkr": "PKR 15 - 25 Lakhs / yr (Living only)",
            "hero_image_url": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop",
            "popular_tag": "Zero/Low Tuition",
        },
        {
            "name": "Australia",
            "code": "AU",
            "slug": "australia",
            "flag_emoji": "🇦🇺",
            "overview": "Home to the Group of Eight (Go8) universities, Australia offers high part-time wage caps and 2 to 4 years post-study work rights depending on study location and degree level.",
            "currency": "AUD",
            "avg_cost_pkr": "PKR 55 - 75 Lakhs / yr",
            "hero_image_url": "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop",
            "popular_tag": "High Wages & PR",
        },
        {
            "name": "United States",
            "code": "US",
            "slug": "usa",
            "flag_emoji": "🇺🇸",
            "overview": "Leading global university research and generous STEM OPT extensions (up to 3 years work authorization). Massive availability of university assistantships and scholarships.",
            "currency": "USD",
            "avg_cost_pkr": "PKR 60 - 90 Lakhs / yr",
            "hero_image_url": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800&auto=format&fit=crop",
            "popular_tag": "Top Ranked & STEM OPT",
        },
        {
            "name": "France",
            "code": "FR",
            "slug": "france",
            "flag_emoji": "🇫🇷",
            "overview": "Heavily subsidized higher education, thousands of English-taught masters programs in business and tech, and government living subsidies (CAF housing allowance) for students.",
            "currency": "EUR",
            "avg_cost_pkr": "PKR 20 - 35 Lakhs / yr",
            "hero_image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
            "popular_tag": "Subsidized & Affordable",
        },
    ]

    countries_map = {}
    for c_data in default_countries:
        c = Country(**c_data, is_active=True)
        db.add(c)
        await db.flush()
        countries_map[c.slug] = c.id

    if admin_user_id:
        uk_id = countries_map.get("uk")
        ger_id = countries_map.get("germany")

        default_posts = [
            {
                "title": "UK Student Visa Process Step by Step: 2026 Complete Guide",
                "slug": "uk-student-visa-process-step-by-step",
                "excerpt": "A comprehensive guide on CAS letters, mandatory 28-day financial balance rules in Pakistani banks, TB test clinics in Islamabad/Lahore, and visa fee calculations.",
                "content": """# UK Student Visa (Subroute) Step-by-Step for Pakistani Applicants

Applying for a UK student visa requires strict adherence to official UK Visas and Immigration (UKVI) guidelines. Below is the verified roadmap:

## 1. Confirmation of Acceptance for Studies (CAS)
Before you apply, your chosen UK institution must assign you a **CAS reference number**. This electronic document confirms that you have an unconditional offer and details your course fees and any payments already made.

## 2. Mandatory 28-Day Financial Requirement
You must show that you have held the required tuition balance plus living expenses in an approved bank for at least **28 consecutive days**:
- **Inside London**: £1,334 per month (up to 9 months = £12,006).
- **Outside London**: £1,023 per month (up to 9 months = £9,207).
- The bank statement must be dated within 31 days before your visa application date.

## 3. Tuberculosis (TB) Screening
Pakistani nationals applying for a UK visa longer than 6 months must obtain a TB test certificate from an approved **IOM (International Organization for Migration)** clinic in Islamabad, Lahore, Karachi, or Mirpur.

## 4. Immigration Health Surcharge (IHS) & Visa Fee
- Visa Application Fee: £490.
- IHS Healthcare Surcharge: £776 per year of study.

Ensure all documents (degree attestations, bank statements, IELTS/PTE reports) are original and translated into English if applicable.""",
                "category": "Visa Guidance",
                "country_id": uk_id,
                "featured_image_url": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop",
                "read_time": "6 min read",
                "is_published": True,
            },
            {
                "title": "Top 10 Fully Funded Scholarships in Europe (DAAD, Erasmus Mundus, Eiffel)",
                "slug": "top-10-fully-funded-scholarships-in-europe",
                "excerpt": "Discover prestigious European scholarship programs offering 100% tuition coverage, monthly stipends up to €1,400, and travel allowances for Pakistani students.",
                "content": """# Prestigious Fully Funded Scholarships Across Europe

European governments and universities offer some of the most generous scholarship programs in the world:

### 1. Erasmus Mundus Joint Master Degrees (EMJMD)
- **Coverage**: 100% tuition, monthly stipend of €1,000 - €1,400, flight tickets, and visa reimbursement.
- **Experience**: Study in at least two different European countries during your degree.
- **Application Window**: October to January annually.

### 2. DAAD EPOS Scholarships (Germany)
- Designed for professionals with at least 2 years of work experience in development-related fields.
- Covers tuition, health insurance, and an €934/month stipend.

### 3. Eiffel Excellence Scholarship (France)
- Awarded by the French Ministry for Europe and Foreign Affairs.
- Covers a monthly allowance of €1,181 and return flights to France.""",
                "category": "Scholarships",
                "country_id": ger_id,
                "featured_image_url": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
                "read_time": "5 min read",
                "is_published": True,
            },
            {
                "title": "How to Get Admission in Top German Public Universities with Zero Tuition",
                "slug": "how-to-get-admission-in-top-german-universities",
                "excerpt": "Everything you need to know about German public universities: Uni-Assist applications, VPD requirements, APS certificates, and opening your blocked bank account (Sperrkonto).",
                "content": """# Zero Tuition Higher Education in Germany

Germany is the #1 destination in Europe for Pakistani students seeking tuition-free master's degrees taught in English.

### Why Germany?
1. **Public Universities charge €0 tuition** (only a semester contribution of €150-€350 including public transit passes).
2. **18-Month Job Search Visa** after graduation.
3. Fast-track permanent residency (PR) after 2 years of skilled employment.

### Application Steps:
1. **Uni-Assist & VPD**: Submit transcripts to Uni-Assist for official German grading conversion (Bavarian Formula).
2. **Blocked Account (Sperrkonto)**: Deposit the mandatory living proof (€11,208/year) via Expatrio, Coracle, or Fintiba.
3. **German Visa Appointment**: Book your appointment through the German Embassy Islamabad or Consulate Karachi early, as wait times can exceed 6-9 months.""",
                "category": "Admissions",
                "country_id": ger_id,
                "featured_image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
                "read_time": "5 min read",
                "is_published": True,
            }
        ]

        for p_data in default_posts:
            post = Post(**p_data, author_id=admin_user_id, views_count=120)
            db.add(post)

    await db.commit()
    print("[UniCompass] Default countries and educational guides seeded successfully.")
