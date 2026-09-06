from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.features.auth.router import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    try:
        await init_db()
        print("[UniCompass] Database initialized successfully.")
    except Exception as e:
        print(f"[UniCompass] Warning: DB init failed: {e}. Ensure DATABASE_URL is reachable.")
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)


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
