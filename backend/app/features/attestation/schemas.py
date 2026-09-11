from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class AttestationStepBase(BaseModel):
    status: str = "not_started"
    notes: Optional[str] = None
    tracking_number: Optional[str] = None
    appointment_date: Optional[str] = None


class AttestationStepUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    tracking_number: Optional[str] = None
    appointment_date: Optional[str] = None


class AttestationStepRead(AttestationStepBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    step_key: str
    title: str
    subtitle: str
    authority_name: str
    portal_url: str
    estimated_duration: str
    estimated_fee_pkr: str
    requirements: List[str]
    procedure_steps: List[str]
    important_note: Optional[str] = None
    completed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class AttestationSummaryRead(BaseModel):
    total_steps: int
    completed_steps: int
    in_progress_steps: int
    completion_percentage: int
    steps: List[AttestationStepRead]


class AttestationGuideItem(BaseModel):
    step_key: str
    title: str
    subtitle: str
    authority_name: str
    portal_url: str
    estimated_duration: str
    estimated_fee_pkr: str
    requirements: List[str]
    procedure_steps: List[str]
    important_note: Optional[str] = None
