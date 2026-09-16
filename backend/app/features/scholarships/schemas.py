from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ScholarshipBase(BaseModel):
    title: str
    provider: str
    country_id: Optional[int] = None
    degree_level: str = "Masters"
    coverage_type: str = "Fully Funded"
    amount_value: Optional[str] = None
    deadline_date: str
    eligibility_criteria: Optional[str] = None
    application_link: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True


class ScholarshipCreate(ScholarshipBase):
    slug: Optional[str] = None


class ScholarshipUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    provider: Optional[str] = None
    country_id: Optional[int] = None
    degree_level: Optional[str] = None
    coverage_type: Optional[str] = None
    amount_value: Optional[str] = None
    deadline_date: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    application_link: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class ScholarshipRead(ScholarshipBase):
    id: int
    slug: str
    country_name: Optional[str] = None
    country_flag_emoji: Optional[str] = None
    country_slug: Optional[str] = None
    is_saved: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScholarshipToggleResponse(BaseModel):
    scholarship_id: int
    is_saved: bool
    message: str


class SavedScholarshipItem(BaseModel):
    id: int
    scholarship_id: int
    scholarship: ScholarshipRead
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
