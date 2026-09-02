from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db
from app.services.models.ollama_client import OllamaProvider
from app.services.rag.qdrant_client import qdrant_service

router = APIRouter(tags=["Health"])
ollama_provider = OllamaProvider()


@router.get("/health", summary="Health Check")
async def health_check(db: Session = Depends(get_db)):
    # Database check
    db_healthy = False
    try:
        db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception:
        pass

    ollama_healthy = await ollama_provider.health_check()
    qdrant_healthy = qdrant_service.health_check()

    overall = "healthy" if db_healthy else "degraded"

    return {
        "status": overall,
        "services": {
            "database": "healthy" if db_healthy else "unhealthy",
            "qdrant": "healthy" if qdrant_healthy else "standalone_mode",
            "ollama": "healthy" if ollama_healthy else "standalone_mode",
            "storage": "healthy"
        }
    }
