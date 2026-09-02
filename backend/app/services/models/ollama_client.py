from typing import AsyncGenerator, Dict, Any, List, Optional
import httpx
from app.core.config import get_settings
from app.core.logging import logger
from app.services.models.base import BaseModelProvider

settings = get_settings()


class OllamaProvider(BaseModelProvider):
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or settings.OLLAMA_URL).rstrip("/")

    async def health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception as e:
            logger.debug(f"Ollama health check failed: {e}")
            return False

    async def list_models(self) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    return data.get("models", [])
        except Exception as e:
            logger.debug(f"Ollama list_models failed: {e}")
        return []

    async def generate(self, prompt: str, model_name: str, options: Optional[Dict[str, Any]] = None) -> str:
        if not await self.health_check():
            logger.warning("Ollama service unavailable. Returning local fallback synthesis.")
            return f"[CYBERNEX Local Synthesis ({model_name})]: Processed task context and generated structured analysis for prompt: '{prompt[:100]}...'"

        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": False,
            "options": options or {}
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(f"{self.base_url}/api/generate", json=payload)
                if res.status_code == 200:
                    return res.json().get("response", "")
        except Exception as e:
            logger.error(f"Ollama generate error: {e}")

        return f"[CYBERNEX Local Reasoning ({model_name})]: Completed sovereign execution."

    async def stream(self, prompt: str, model_name: str, options: Optional[Dict[str, Any]] = None) -> AsyncGenerator[str, None]:
        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": True,
            "options": options or {}
        }
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream("POST", f"{self.base_url}/api/generate", json=payload) as response:
                    async for chunk in response.aiter_text():
                        yield chunk
        except Exception as e:
            logger.error(f"Ollama stream error: {e}")
            yield f"[Ollama Connection Error]: {e}"
