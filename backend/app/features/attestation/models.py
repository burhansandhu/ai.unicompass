from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base


class AttestationRecord(Base):
    __tablename__ = "attestation_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    step_key = Column(String(50), nullable=False, index=True)  # "ibcc", "hec", "mofa", "police_passport"
    status = Column(String(30), default="not_started", nullable=False)  # "not_started", "in_progress", "completed"
    notes = Column(Text, nullable=True)
    tracking_number = Column(String(100), nullable=True)
    appointment_date = Column(String(50), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("user_id", "step_key", name="uq_user_attestation_step"),
    )
