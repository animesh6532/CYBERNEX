from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.model import AIModelSchema

from app.core.config import get_settings
from app.services.models.ollama_client import OllamaProvider

router = APIRouter(prefix="/models", tags=["Models"])
ollama_provider = OllamaProvider()
settings = get_settings()


@router.get("", response_model=List[AIModelSchema], summary="List Sovereign AI Models")
async def list_models(db: Session = Depends(get_db)):
    is_ollama_online = await ollama_provider.health_check()
    if not is_ollama_online:
        return []

    ollama_models = await ollama_provider.list_models()
    result: List[AIModelSchema] = []

    for idx, raw_model in enumerate(ollama_models):
        name = raw_model.get("name", f"model-{idx}")
        details = raw_model.get("details", {})
        parameter_size = details.get("parameter_size", "")
        family = details.get("family", "")

        category = "GENERAL"
        if "code" in name.lower() or "coder" in name.lower():
            category = "CODING"
        elif "vision" in name.lower() or "llava" in name.lower():
            category = "VISION"

        size_bytes = raw_model.get("size", 0)
        size_gb = f"{round(size_bytes / (1024 ** 3), 1)} GB" if size_bytes else "N/A"

        result.append(
            AIModelSchema(
                id=f"ollama-{name}",
                name=name,
                role=f"{family.capitalize()} ({parameter_size})" if family else "Local Reasoning",
                category=category,
                status="ONLINE",
                localInference=True,
                contextWindow="8,192 tokens",
                vramUsage=size_gb,
                gpuLoad=0,
                throughput="Local",
                lastCheck="Now"
            )
        )

    return result

