import uuid
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import httpx

from app.core.config import get_settings
from app.core.logging import logger
from app.services.router.model_router import route_request
from app.services.router.model_registry import get_model_for_task

settings = get_settings()
router = APIRouter()

OLLAMA_GENERATE_URL = f"{settings.OLLAMA_URL}/api/generate"


class TaskRequest(BaseModel):
    prompt: str | None = None
    description: str | None = None
    model: str | None = "Auto"
    requested_model: str | None = None
    files: List[Dict[str, Any]] | None = []

    @property
    def query(self) -> str:
        return self.prompt or self.description or ""

    @property
    def model_preference(self) -> str:
        return self.requested_model or self.model or "Auto"


@router.post("", summary="Execute Task / Chat")
@router.post("/", include_in_schema=False)
async def chat_endpoint(request: TaskRequest):
    user_query = request.query
    if not user_query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt or description field is required."
        )

    # Check for image attachments
    has_image = any(
        f.get("file_type") == "IMAGE" or
        any(ext in f.get("original_name", "").lower() for ext in [".png", ".jpg", ".jpeg", ".webp"])
        for f in (request.files or [])
    )

    # Route request (Honors user preference or runs Zero-Shot LLM router)
    routing_result = await route_request(
        prompt=user_query,
        has_image=has_image,
        requested_model=request.model_preference
    )
    
    task_type = routing_result["task_type"]
    selected_model = get_model_for_task(task_type)

    logger.info(
        f"[ROUTER] Task: {task_type} | "
        f"Confidence: {routing_result['confidence']} | "
        f"Method: {routing_result['method']} | "
        f"Time: {routing_result['latency_ms']}ms | "
        f"Model: {selected_model}"
    )

    payload = {
    "model": selected_model,
    "prompt": user_query,
    "stream": False,
    "keep_alive": "30m",  # Keeps model in VRAM for 30 minutes
    "options": {
        "num_ctx": 2048   # Optimizes VRAM usage for 4GB GPUs
    }
}

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            response = await client.post(OLLAMA_GENERATE_URL, json=payload)
            response.raise_for_status()
            result_text = response.json().get("response", "")
    except Exception as e:
        logger.error(f"Ollama communication error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Local LLM service unavailable: {str(e)}"
        )

    task_id = f"task_{uuid.uuid4().hex[:8]}"

    return {
        "id": task_id,
        "task_id": task_id,
        "status": "completed",
        "task_type": task_type,
        "prompt": user_query,
        "output": result_text,
        "result": result_text,
        "response": result_text,
        "model_used": selected_model,
        "routing": routing_result
    }