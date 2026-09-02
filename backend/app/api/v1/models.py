from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.model import AIModelSchema

router = APIRouter(prefix="/models", tags=["Models"])


@router.get("", response_model=List[AIModelSchema], summary="List Sovereign AI Models")
def list_models(db: Session = Depends(get_db)):
    db_models = db.query(models.Model).all()
    if not db_models:
        # Seed default models
        defaults = [
            models.Model(
                id="m1",
                name="CYBERNEX General (Llama-3-70B)",
                role="Reasoning & Synthesis",
                category="GENERAL",
                status="ONLINE",
                local_inference=True,
                context_window="128,000 tokens",
                vram_usage="38.4 / 48.0 GB",
                gpu_load=42,
                throughput="48.5 t/s",
                last_check="1s ago"
            ),
            models.Model(
                id="m2",
                name="CYBERNEX Code (Qwen2.5-Coder-32B)",
                role="Sandboxed Code & Scripts",
                category="CODING",
                status="ONLINE",
                local_inference=True,
                context_window="64,000 tokens",
                vram_usage="18.2 / 24.0 GB",
                gpu_load=12,
                throughput="72.1 t/s",
                last_check="2s ago"
            ),
            models.Model(
                id="m3",
                name="CYBERNEX Vision (Llama-3.2-Vision)",
                role="Multimodal & Technical Diagrams",
                category="VISION",
                status="ONLINE",
                local_inference=True,
                context_window="32,000 tokens",
                vram_usage="14.0 / 24.0 GB",
                gpu_load=0,
                throughput="34.0 t/s",
                last_check="1s ago"
            ),
            models.Model(
                id="m4",
                name="CYBERNEX Embed (BGE-M3-Multilingual)",
                role="Local Dense & Sparse RAG",
                category="EMBEDDING",
                status="ONLINE",
                local_inference=True,
                context_window="8,192 tokens",
                vram_usage="4.2 / 12.0 GB",
                gpu_load=5,
                throughput="1,200 docs/s",
                last_check="1s ago"
            ),
        ]
        db.add_all(defaults)
        db.commit()
        db_models = defaults

    return [
        AIModelSchema(
            id=m.id,
            name=m.name,
            role=m.role,
            category=m.category,
            status=m.status,
            localInference=m.local_inference,
            contextWindow=m.context_window,
            vramUsage=m.vram_usage,
            gpuLoad=m.gpu_load,
            throughput=m.throughput,
            lastCheck=m.last_check
        ) for m in db_models
    ]
