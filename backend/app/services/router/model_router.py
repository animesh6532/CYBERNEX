"""from typing import List, Dict, Any
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
        
        #Routes the incoming task to the optimal local model based on intent and attachments.
        
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


model_router = ModelRouter()"""


import re
import json
import time
import httpx
from app.services.router.model_registry import get_model_for_task
from app.core.config import get_settings

settings = get_settings()

OLLAMA_GENERATE_URL = f"{settings.OLLAMA_URL}/api/generate"

ROUTER_PROMPT_TEMPLATE = """You are an intent classification system for an AI workbench.
Classify the user's request into exactly one of these task types:
- CODING: Requests to write, debug, refactor, or explain software code, algorithms, scripts, or queries.
- VISION: Requests to inspect, identify, or describe images, blueprints, diagrams, or scanned drawings.
- GENERAL: General knowledge, reasoning, casual conversation, or tasks that do not fit the above.

User request: "{user_prompt}"

Output MUST be valid JSON only with this schema:
{{"task": "CODING" | "VISION" | "GENERAL", "confidence": 0.0 to 1.0}}
Do not include any other commentary or markdown formatting."""


def check_deterministic_rules(prompt: str, has_image: bool = False) -> str | None:
    if has_image:
        return "VISION"

    code_syntax_pattern = r"(```|\bdef\s+\w+\(|\bclass\s+\w+:|\bimport\s+\w+|\bSELECT\s+.+\s+FROM\b)"
    if re.search(code_syntax_pattern, prompt):
        return "CODING"

    return None


async def classify_task_with_llm(prompt: str, classifier_model: str = None) -> tuple[str, float]:
    if classifier_model is None:
        classifier_model = settings.GENERAL_MODEL

    formatted_prompt = ROUTER_PROMPT_TEMPLATE.format(user_prompt=prompt)
    
    payload = {
        "model": classifier_model,
        "prompt": formatted_prompt,
        "stream": False,
        "format": "json",
        "keep_alive": -1,
        "options": {
            "temperature": 0.0,
            "num_predict": 30
        }
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
            response = await client.post(OLLAMA_GENERATE_URL, json=payload)
            response.raise_for_status()
            raw_output = response.json().get("response", "{}")
            parsed = json.loads(raw_output)
            
            task = parsed.get("task", "GENERAL").upper()
            confidence = float(parsed.get("confidence", 0.8))
            
            valid_tasks = {"CODING", "VISION", "GENERAL"}
            if task not in valid_tasks:
                task = "GENERAL"
                
            return task, confidence
    except Exception as e:
        print(f"[Router Error] LLM classification failed ({e}), falling back to GENERAL.")
        return "GENERAL", 0.5


async def route_request(
    prompt: str, 
    has_image: bool = False, 
    requested_model: str = "Auto",
    classifier_model: str = None
) -> dict:

    start_time = time.perf_counter()

    # Step 1: User Manual Override Check (from UI selection buttons)
    if requested_model and requested_model.lower() != "auto":
        req_lower = requested_model.lower()
        if "code" in req_lower or "coding" in req_lower:
            override_task = "CODING"
        elif "vision" in req_lower:
            override_task = "VISION"
        else:
            override_task = "GENERAL"

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return {
            "task_type": override_task,
            "confidence": 1.0,
            "method": "user_override",
            "latency_ms": latency_ms
        }

    # Step 2: Deterministic Rules Check
    deterministic_task = check_deterministic_rules(prompt, has_image)
    if deterministic_task:
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return {
            "task_type": deterministic_task,
            "confidence": 1.0,
            "method": "deterministic_rule",
            "latency_ms": latency_ms
        }

    # Step 3: Zero-Shot LLM Classification
    task, confidence = await classify_task_with_llm(prompt, classifier_model=classifier_model)
    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

    return {
        "task_type": task,
        "confidence": confidence,
        "method": "zero_shot_llm",
        "latency_ms": latency_ms
    }
