import base64
import json
import os
from typing import Any, Dict

from app.core.config import get_settings
from app.core.logging import logger
from app.services.models.ollama_client import OllamaProvider

settings = get_settings()
ollama_provider = OllamaProvider()


class VisionService:
    async def analyze_image(self, image_path: str, prompt: str = "Analyze this engineering diagram") -> Dict[str, Any]:
        """
        Processes engineering images/diagrams using the local Ollama vision model.
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        filename = os.path.basename(image_path)
        logger.info(f"Analyzing vision asset {filename} with prompt '{prompt}'")

        try:
            with open(image_path, "rb") as f:
                image_b64 = base64.b64encode(f.read()).decode("utf-8")

            analysis_prompt = (
                f"{prompt}\n\n"
                "Return valid JSON only with a 'description' field. "
                "If you cannot determine details, provide a short honest description."
            )

            response = await ollama_provider.generate(
                prompt=analysis_prompt,
                model_name=settings.VISION_MODEL,
                images=[image_b64]
            )

            parsed_response = None
            try:
                parsed_response = json.loads(response)
            except Exception:
                parsed_response = None

            description = response
            if isinstance(parsed_response, dict):
                description = parsed_response.get("description", response)

            return {
                "description": description,
                "model": settings.VISION_MODEL,
                "source_file": filename
            }
        except Exception as e:
            logger.error(f"Vision processing failed: {e}")
            return {
                "description": f"Error loading image: {e}",
                "model": settings.VISION_MODEL,
                "source_file": filename
            }


vision_service = VisionService()
