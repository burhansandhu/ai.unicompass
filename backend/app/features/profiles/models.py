from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # 1. Secondary / Higher Secondary Education
    secondary_education_type = Column(String(100), nullable=True)  # e.g. "Matriculation (Science)", "O-Levels"
    secondary_grades = Column(String(50), nullable=True)           # e.g. "88%", "3 As, 2 Bs"
    higher_secondary_type = Column(String(100), nullable=True)     # e.g. "FSc Pre-Engineering", "FSc Pre-Medical", "ICS", "A-Levels"
    higher_secondary_grades = Column(String(50), nullable=True)    # e.g. "82%", "A*AA"

    # 2. Tertiary Education
    degree_level = Column(String(50), nullable=True)               # e.g. "Bachelors", "Masters"
    degree_type = Column(String(100), nullable=True)               # e.g. "4-Year BS Honors", "2-Year BA/BSc"
    degree_field = Column(String(150), nullable=True)              # e.g. "BS Computer Science", "BBA"
    conferring_university = Column(String(200), nullable=True)     # e.g. "NUST", "FAST-NUCES", "Punjab University"
    cgpa = Column(Float, nullable=True)                            # e.g. 3.42
    cgpa_scale = Column(Float, default=4.0, nullable=False)        # e.g. 4.0 or 5.0
    hec_recognized = Column(Boolean, default=True, nullable=False)
    graduation_year = Column(Integer, nullable=True)               # e.g. 2024

    # 3. Language Proficiency & Waivers
    english_test_type = Column(String(50), nullable=True)          # e.g. "IELTS Academic", "PTE", "Duolingo", "MOI Waiver", "Planned"
    english_overall_score = Column(Float, nullable=True)           # e.g. 7.0 or 65.0
    listening_score = Column(Float, nullable=True)                 # e.g. 7.5
    reading_score = Column(Float, nullable=True)                   # e.g. 6.5
    writing_score = Column(Float, nullable=True)                   # e.g. 6.5
    speaking_score = Column(Float, nullable=True)                  # e.g. 7.0
    moi_eligible = Column(Boolean, default=False, nullable=False)  # Medium of Instruction waiver from English university
    test_date_or_planned = Column(String(100), nullable=True)      # e.g. "Completed (June 2026)", "Planning for Dec 2026"

    # 4. Work Experience & Gaps
    work_experience_years = Column(Float, default=0.0, nullable=False)
    current_job_title = Column(String(150), nullable=True)
    academic_gap_years = Column(Float, default=0.0, nullable=False)
    gap_explanation = Column(Text, nullable=True)

    # 5. Financials & Target Preferences
    max_annual_budget_pkr = Column(Float, nullable=True)           # In PKR (e.g. 3500000)
    funding_source = Column(String(100), nullable=True)            # e.g. "Self-funded / Family", "Full Scholarship"
    has_28_day_bank_balance = Column(Boolean, default=False, nullable=False)
    target_destinations = Column(JSON, default=list, nullable=False) # e.g. ["UK", "Germany", "Canada"]
    target_degree_level = Column(String(50), nullable=True)        # e.g. "Masters", "Bachelors"
    target_field = Column(String(150), nullable=True)              # e.g. "Computer Science / AI"
    target_intake = Column(String(100), nullable=True)             # e.g. "Fall 2026 (Sep/Oct)", "Spring 2027 (Jan/Feb)"

    # Profile Completeness Score (0-100%)
    completeness_percentage = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship to User
    user = relationship("User", backref="profile")

    def __repr__(self) -> str:
        return f"<StudentProfile user_id={self.user_id} completeness={self.completeness_percentage}%>"
