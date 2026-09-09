from app.core.config import get_settings

settings = get_settings()

def get_model_for_task(task_type: str) -> str:
    models = {
        "GENERAL": settings.GENERAL_MODEL,
        "CODING": settings.CODING_MODEL,
        "VISION": settings.VISION_MODEL,
    }
    return models.get(task_type, settings.GENERAL_MODEL)