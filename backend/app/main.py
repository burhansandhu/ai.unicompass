from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db, AsyncSessionLocal
from app.core.constants import UserRole
from app.features.users.models import User
from app.features.content.models import Country, Post
from app.features.profiles.models import StudentProfile
from app.features.attestation.models import AttestationRecord
from app.features.discovery.models import University, Program, ShortlistedProgram
from app.features.timeline.models import StudentMilestone
from app.features.content.service import seed_content_if_empty
from app.features.discovery.service import seed_discovery_data_if_empty
from app.features.auth.router import router as auth_router
from app.features.content.router import router as content_router
from app.features.profiles.router import router as profiles_router
from app.features.attestation.router import router as attestation_router
from app.features.discovery.router import router as discovery_router
from app.features.timeline.router import router as timeline_router
from sqlalchemy import select


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed initial content on startup
    try:
        await init_db()
        print("[UniCompass] Database initialized successfully.")
        async with AsyncSessionLocal() as session:
            admin_res = await session.execute(
                select(User.id).where(User.role == UserRole.ADMIN).limit(1)
            )
            admin_id = admin_res.scalar_one_or_none()
            if not admin_id:
                user_res = await session.execute(select(User.id).limit(1))
                admin_id = user_res.scalar_one_or_none() or 1
            await seed_content_if_empty(session, admin_user_id=admin_id)
            await seed_discovery_data_if_empty(session)
    except Exception as e:
        print(f"[UniCompass] Warning: DB init/seed failed: {e}.")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="UniCompass - Personalized Study Abroad Decision and Application Planning Platform API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Custom Validation Error Handler returning a single clean 1-line string in {"detail": "..."}
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    if not errors:
        message = "Invalid request parameters."
    else:
        first_error = errors[0]
        ctx = first_error.get("ctx", {})
        # If there's an explicit reason (e.g. email validation reason: "An email address must have an @-sign.")
        if "reason" in ctx and ctx["reason"]:
            message = str(ctx["reason"])
        else:
            msg = first_error.get("msg", "Invalid value provided.")
            # Strip redundant internal prefixes
            if msg.startswith("Value error, "):
                msg = msg.replace("Value error, ", "", 1)
            if "value is not a valid email address: " in msg:
                msg = msg.replace("value is not a valid email address: ", "", 1)
            message = msg

    if message:
        message = message[0].upper() + message[1:]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": message},
    )


# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers (support both /api and root)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(auth_router)
app.include_router(content_router, prefix=settings.API_V1_STR)
app.include_router(content_router)
app.include_router(profiles_router, prefix=settings.API_V1_STR)
app.include_router(profiles_router)
app.include_router(attestation_router, prefix=settings.API_V1_STR)
app.include_router(attestation_router)
app.include_router(discovery_router, prefix=settings.API_V1_STR)
app.include_router(discovery_router)
app.include_router(timeline_router, prefix=settings.API_V1_STR)
app.include_router(timeline_router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "app": "UniCompass API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "unicompass-api"}
