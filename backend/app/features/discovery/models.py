from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    world_ranking = Column(Integer, nullable=True)
    logo_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    website_url = Column(String(500), nullable=True)

    # Pakistani MOI English Waiver acceptance flag and requirements
    accepts_moi_waiver = Column(Boolean, default=False, nullable=False)
    moi_conditions = Column(Text, nullable=True)  # e.g., "Accepted for HEC-recognized English medium degrees with min 65% / 2.8 CGPA"

    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    country = relationship("Country", backref="universities")
    programs = relationship("Program", back_populates="university", cascade="all, delete-orphan")


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    university_id = Column(Integer, ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(250), nullable=False)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    degree_level = Column(String(50), nullable=False)  # "Bachelors", "Masters", "PhD"
    discipline = Column(String(100), nullable=False)  # "Computer Science & IT", "Engineering", "Business & Management", "Health Sciences", etc.
    duration_years = Column(Float, default=1.0, nullable=False)
    intake_seasons = Column(JSON, default=list, nullable=False)  # ["Fall", "Spring"]

    # Pakistani eligibility cutoffs
    min_cgpa = Column(Float, default=2.5, nullable=False)
    min_cgpa_scale = Column(Float, default=4.0, nullable=False)

    # Costs in original currency
    annual_tuition_original = Column(Float, default=0.0, nullable=False)
    currency_code = Column(String(10), default="USD", nullable=False)  # "GBP", "EUR", "CAD", "AUD", "USD"
    currency_symbol = Column(String(10), default="$", nullable=False)  # "£", "€", "$", "A$"

    # English requirements & MOI
    min_ielts_score = Column(Float, nullable=True)
    min_pte_score = Column(Integer, nullable=True)
    accepts_moi = Column(Boolean, default=False, nullable=False)

    # Application deadlines
    application_deadline_fall = Column(String(50), nullable=True)   # e.g. "31 Jan 2027"
    application_deadline_spring = Column(String(50), nullable=True) # e.g. "15 Oct 2026"

    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    university = relationship("University", back_populates="programs")


class ShortlistedProgram(Base):
    __tablename__ = "shortlisted_programs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    program_id = Column(Integer, ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    program = relationship("Program")

    __table_args__ = (
        UniqueConstraint("user_id", "program_id", name="uq_user_shortlist_program"),
    )
