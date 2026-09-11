from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class StudentProfileBase(BaseModel):
    # 1. Secondary / Higher Secondary
    secondary_education_type: Optional[str] = Field(None, max_length=100)
    secondary_grades: Optional[str] = Field(None, max_length=50)
    higher_secondary_type: Optional[str] = Field(None, max_length=100)
    higher_secondary_grades: Optional[str] = Field(None, max_length=50)

    # 2. Tertiary Education
    degree_level: Optional[str] = Field(None, max_length=50)
    degree_type: Optional[str] = Field(None, max_length=100)
    degree_field: Optional[str] = Field(None, max_length=150)
    conferring_university: Optional[str] = Field(None, max_length=200)
    cgpa: Optional[float] = Field(None, ge=0.0, le=5.0)
    cgpa_scale: float = Field(default=4.0, ge=1.0, le=10.0)
    hec_recognized: bool = True
    graduation_year: Optional[int] = Field(None, ge=1990, le=2035)

    # 3. Language & Tests
    english_test_type: Optional[str] = Field(None, max_length=50)
    english_overall_score: Optional[float] = Field(None, ge=0.0, le=160.0)
    listening_score: Optional[float] = Field(None, ge=0.0, le=90.0)
    reading_score: Optional[float] = Field(None, ge=0.0, le=90.0)
    writing_score: Optional[float] = Field(None, ge=0.0, le=90.0)
    speaking_score: Optional[float] = Field(None, ge=0.0, le=90.0)
    moi_eligible: bool = False
    test_date_or_planned: Optional[str] = Field(None, max_length=100)

    # 4. Work & Gaps
    work_experience_years: float = Field(default=0.0, ge=0.0, le=40.0)
    current_job_title: Optional[str] = Field(None, max_length=150)
    academic_gap_years: float = Field(default=0.0, ge=0.0, le=20.0)
    gap_explanation: Optional[str] = None

    # 5. Financials & Target Preferences
    max_annual_budget_pkr: Optional[float] = Field(None, ge=0.0)
    funding_source: Optional[str] = Field(None, max_length=100)
    has_28_day_bank_balance: bool = False
    target_destinations: List[str] = Field(default_factory=list)
    target_degree_level: Optional[str] = Field(None, max_length=50)
    target_field: Optional[str] = Field(None, max_length=150)
    target_intake: Optional[str] = Field(None, max_length=100)


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileUpdate(BaseModel):
    secondary_education_type: Optional[str] = None
    secondary_grades: Optional[str] = None
    higher_secondary_type: Optional[str] = None
    higher_secondary_grades: Optional[str] = None

    degree_level: Optional[str] = None
    degree_type: Optional[str] = None
    degree_field: Optional[str] = None
    conferring_university: Optional[str] = None
    cgpa: Optional[float] = None
    cgpa_scale: Optional[float] = None
    hec_recognized: Optional[bool] = None
    graduation_year: Optional[int] = None

    english_test_type: Optional[str] = None
    english_overall_score: Optional[float] = None
    listening_score: Optional[float] = None
    reading_score: Optional[float] = None
    writing_score: Optional[float] = None
    speaking_score: Optional[float] = None
    moi_eligible: Optional[bool] = None
    test_date_or_planned: Optional[str] = None

    work_experience_years: Optional[float] = None
    current_job_title: Optional[str] = None
    academic_gap_years: Optional[float] = None
    gap_explanation: Optional[str] = None

    max_annual_budget_pkr: Optional[float] = None
    funding_source: Optional[str] = None
    has_28_day_bank_balance: Optional[bool] = None
    target_destinations: Optional[List[str]] = None
    target_degree_level: Optional[str] = None
    target_field: Optional[str] = None
    target_intake: Optional[str] = None


class StudentProfileRead(StudentProfileBase):
    id: int
    user_id: int
    completeness_percentage: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
