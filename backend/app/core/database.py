from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Engine configuration
is_sqlite = "sqlite" in settings.DATABASE_URL
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    # Auto-create tables for development
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Migrate new columns safely for existing tables
        from sqlalchemy import text
        try:
            await conn.execute(text("ALTER TABLE countries ADD COLUMN IF NOT EXISTS work_hours_per_week VARCHAR(50) DEFAULT '20 hrs / week';"))
            await conn.execute(text("ALTER TABLE countries ADD COLUMN IF NOT EXISTS post_study_work_visa VARCHAR(100) DEFAULT '18 - 36 Months';"))
        except Exception:
            pass
