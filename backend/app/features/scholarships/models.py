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
from sqlalchemy.orm import relationship
from app.core.database import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    provider = Column(String(255), nullable=False)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="SET NULL"), nullable=True)
    degree_level = Column(String(100), nullable=False, default="Masters")  # Bachelors, Masters, PhD, All Levels
    coverage_type = Column(String(100), nullable=False, default="Fully Funded")  # Fully Funded, Full Tuition, Partial, Stipend
    amount_value = Column(String(255), nullable=True)  # e.g. "100% Tuition + €934/mo + Flights"
    deadline_date = Column(String(100), nullable=False)  # e.g. "31 Oct 2026"
    eligibility_criteria = Column(Text, nullable=True)
    application_link = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    country = relationship("Country", lazy="joined")
    saved_by = relationship("SavedScholarship", back_populates="scholarship", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Scholarship id={self.id} title='{self.title}'>"


class SavedScholarship(Base):
    __tablename__ = "saved_scholarships"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    scholarship = relationship("Scholarship", back_populates="saved_by")
    user = relationship("User")

    __table_args__ = (
        UniqueConstraint("user_id", "scholarship_id", name="uq_user_saved_scholarship"),
    )

    def __repr__(self) -> str:
        return f"<SavedScholarship user_id={self.user_id} scholarship_id={self.scholarship_id}>"
