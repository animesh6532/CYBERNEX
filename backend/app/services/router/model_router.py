from typing import List, Dict, Any
from app.core.config import get_settings
from app.schemas.model import ModelRouteResult

settings = get_settings()


class ModelRouter:
    def route_task(
        self,
        prompt: str,
        tools: List[str],
        files: List[Dict[str, Any]],
        requested_model: str = "Auto"
    ) -> ModelRouteResult:
        """
        Routes the incoming task to the optimal local model based on intent and attachments.
        """
        if requested_model and requested_model != "Auto":
            if "code" in requested_model.lower():
                return ModelRouteResult(
                    selected_model=settings.CODING_MODEL,
                    category="CODING",
                    reason=f"User explicitly selected {requested_model} model."
                )
            elif "vision" in requested_model.lower():
                return ModelRouteResult(
                    selected_model=settings.VISION_MODEL,
                    category="VISION",
                    reason=f"User explicitly selected {requested_model} model."
                )
            else:
                return ModelRouteResult(
                    selected_model=settings.GENERAL_MODEL,
                    category="GENERAL",
                    reason=f"User explicitly selected {requested_model} model."
                )

        # Automatic Routing Logic
        has_image = any(
            f.get("file_type") == "IMAGE" or
            any(ext in f.get("original_name", "").lower() for ext in [".png", ".jpg", ".jpeg", ".webp"])
            for f in files
        )

        has_code = any(
            f.get("file_type") == "CODE" or
            any(ext in f.get("original_name", "").lower() for ext in [".py", ".js", ".ts", ".json", ".csv"])
            for f in files
        )

        code_keywords = ["write code", "python", "script", "debug", "refactor", "function", "class", "algorithm"]
        prompt_has_code = any(kw in prompt.lower() for kw in code_keywords)

        vision_keywords = ["diagram", "p&id", "inspection image", "visual", "schematic", "blueprint"]
        prompt_has_vision = any(kw in prompt.lower() for kw in vision_keywords)

        if has_image or prompt_has_vision:
            return ModelRouteResult(
                selected_model=settings.VISION_MODEL,
                category="VISION",
                reason="Detected technical visual diagrams or image attachments. Routing to Vision Model."
            )
        elif has_code or prompt_has_code or "Code" in tools:
            return ModelRouteResult(
                selected_model=settings.CODING_MODEL,
                category="CODING",
                reason="Detected software engineering / sandboxed code execution intent. Routing to Code Model."
            )
        else:
            return ModelRouteResult(
                selected_model=settings.GENERAL_MODEL,
                category="GENERAL",
                reason="Selected General Reasoning model for multimodal document analysis & synthesis."
            )


model_router = ModelRouter()
