from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from app.core.database import Base


class StudentMilestone(Base):
    __tablename__ = "student_milestones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    milestone_key = Column(String(50), nullable=False, index=True)  # "ielts_target", "app_submission", "tuition_deposit", "bank_balance_start", "visa_filing"
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(String(50), nullable=False)  # ISO string or human-readable date "YYYY-MM-DD"
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("user_id", "milestone_key", name="uq_user_timeline_milestone"),
    )
