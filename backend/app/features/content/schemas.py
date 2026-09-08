from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class CountryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    code: str = Field(..., min_length=2, max_length=10)
    flag_emoji: str = Field(..., max_length=10)
    overview: str
    currency: str = Field(default="USD", max_length=10)
    avg_cost_pkr: Optional[str] = None
    hero_image_url: Optional[str] = None
    popular_tag: Optional[str] = None
    is_active: bool = True


class CountryCreate(CountryBase):
    slug: Optional[str] = None  # Auto-generated from name if not provided


class CountryUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    slug: Optional[str] = None
    flag_emoji: Optional[str] = None
    overview: Optional[str] = None
    currency: Optional[str] = None
    avg_cost_pkr: Optional[str] = None
    hero_image_url: Optional[str] = None
    popular_tag: Optional[str] = None
    is_active: Optional[bool] = None


class CountryRead(CountryBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PostBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    excerpt: str = Field(..., min_length=10)
    content: str = Field(..., min_length=20)
    category: str = Field(default="General", max_length=100)
    country_id: Optional[int] = None
    featured_image_url: Optional[str] = None
    read_time: str = Field(default="5 min read", max_length=50)
    is_published: bool = True


class PostCreate(PostBase):
    slug: Optional[str] = None  # Auto-generated if not provided


class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    country_id: Optional[int] = None
    featured_image_url: Optional[str] = None
    read_time: Optional[str] = None
    is_published: Optional[bool] = None


class AuthorSummary(BaseModel):
    id: int
    full_name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class PostRead(PostBase):
    id: int
    slug: str
    author_id: int
    views_count: int
    created_at: datetime
    updated_at: datetime
    country: Optional[CountryRead] = None
    author: Optional[AuthorSummary] = None

    model_config = ConfigDict(from_attributes=True)


class CountryDetail(CountryRead):
    posts: List[PostRead] = []

    model_config = ConfigDict(from_attributes=True)
