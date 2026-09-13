from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class MilestoneItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    milestone_key: str
    title: str
    description: str
    target_date: str
    days_left: int
    status: str  # "completed", "due_soon", "upcoming", "passed"
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    pakistani_guidance_tip: str
    category: str  # "exam", "admission", "finance", "visa"


class ProgramDeadlineItem(BaseModel):
    program_id: int
    program_name: str
    university_name: str
    country_name: str
    country_flag_emoji: str
    deadline_date: str
    days_left: int
    status: str
    badge_color: str


class SelectedProgramInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    program_id: int
    program_name: str
    university_name: str
    university_logo_url: Optional[str] = None
    country_name: str
    country_flag_emoji: str
    deadline_date: str
    days_left: int
    accepts_moi: bool = False
    min_ielts_score: Optional[float] = None
    annual_tuition_formatted: Optional[str] = None


class TimelineSummaryRead(BaseModel):
    has_selected_university: bool = False
    selected_program: Optional[SelectedProgramInfo] = None
    target_intake_season: str
    target_intake_year: int
    intake_label: str
    anchor_date: str
    days_until_intake: int
    completed_milestones: int
    total_milestones: int
    milestones: List[MilestoneItemRead]
    program_deadlines: List[ProgramDeadlineItem]


class MilestoneUpdatePayload(BaseModel):
    is_completed: Optional[bool] = None
    target_date: Optional[str] = None
    notes: Optional[str] = None
