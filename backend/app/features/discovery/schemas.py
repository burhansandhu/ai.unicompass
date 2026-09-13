from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class UniversityBase(BaseModel):
    name: str
    slug: str
    city: str
    world_ranking: Optional[int] = None
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    website_url: Optional[str] = None
    accepts_moi_waiver: bool = False
    moi_conditions: Optional[str] = None
    is_active: bool = True


class UniversityRead(UniversityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    country_id: int
    country_name: str = ""
    country_code: str = ""
    country_flag_emoji: str = ""
    programs_count: int = 0


class ProgramBase(BaseModel):
    name: str
    slug: str
    degree_level: str
    discipline: str
    duration_years: float = 1.0
    intake_seasons: List[str] = ["Fall"]
    min_cgpa: float = 2.5
    min_cgpa_scale: float = 4.0
    annual_tuition_original: float = 0.0
    currency_code: str = "USD"
    currency_symbol: str = "$"
    min_ielts_score: Optional[float] = None
    min_pte_score: Optional[int] = None
    accepts_moi: bool = False
    application_deadline_fall: Optional[str] = None
    application_deadline_spring: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True


class ProgramRead(ProgramBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    university_id: int
    university_name: str
    university_city: str
    university_logo_url: Optional[str] = None
    university_world_ranking: Optional[int] = None
    country_id: int
    country_name: str
    country_code: str
    country_flag_emoji: str

    # Real-Time Computed PKR Values
    annual_tuition_pkr: float = 0.0
    annual_living_cost_pkr: float = 0.0
    total_annual_cost_pkr: float = 0.0

    # Pakistani Evaluation Badges
    moi_waiver_eligible: bool = False
    moi_conditions: Optional[str] = None
    is_shortlisted: bool = False
    match_status: Optional[str] = None  # "eligible", "competitive", "stretch"
    match_reason: Optional[str] = None


class ProgramFilterParams(BaseModel):
    search: Optional[str] = None
    country_slug: Optional[str] = None
    degree_level: Optional[str] = None
    discipline: Optional[str] = None
    max_budget_pkr: Optional[float] = None
    moi_only: Optional[bool] = None
    limit: int = 50
    offset: int = 0


class ShortlistToggleResponse(BaseModel):
    shortlisted: bool
    program_id: int
    message: str


class ShortlistedProgramItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    program_id: int
    notes: Optional[str] = None
    created_at: datetime
    program: ProgramRead
