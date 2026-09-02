from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.logging import logger
from app.db.database import init_db
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CYBERNEX Sovereign Backend...")
    settings.init_storage_dirs()
    init_db()
    logger.info("Database and storage directories ready.")
    yield
    logger.info("Shutting down CYBERNEX Backend.")


app = FastAPI(
    title="CYBERNEX API",
    description="Sovereign On-Premise Agentic AI Workbench API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = list(set(settings.CORS_ORIGINS + [settings.FRONTEND_URL]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code} for {request.url.path}")
    return response


@app.get("/health", summary="Root Health Check", tags=["Health"])
def root_health():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }


# Include API v1 Router
app.include_router(api_router, prefix="/api/v1")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred.",
                "details": str(exc) if settings.DEBUG else None
            }
        }
    )
