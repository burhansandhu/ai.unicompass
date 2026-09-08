from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    flag_emoji = Column(String(10), nullable=False)
    overview = Column(Text, nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    avg_cost_pkr = Column(String(50), nullable=True)
    work_hours_per_week = Column(String(50), nullable=True, default="20 hrs / week")
    post_study_work_visa = Column(String(100), nullable=True, default="18 - 36 Months")
    hero_image_url = Column(String(500), nullable=True)
    popular_tag = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    posts = relationship("Post", back_populates="country", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Country id={self.id} name={self.name} slug={self.slug}>"


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="SET NULL"), nullable=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), default="General", nullable=False, index=True)
    featured_image_url = Column(String(500), nullable=True)
    read_time = Column(String(50), default="5 min read", nullable=False)
    is_published = Column(Boolean, default=True, nullable=False, index=True)
    views_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    country = relationship("Country", back_populates="posts")
    author = relationship("User")

    def __repr__(self) -> str:
        return f"<Post id={self.id} title={self.title[:30]} slug={self.slug}>"
