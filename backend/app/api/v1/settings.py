from typing import Dict, Any
from fastapi import APIRouter, Body

router = APIRouter(prefix="/settings", tags=["Settings"])

DEFAULT_SETTINGS = {
    "theme": "light_sky",
    "autoRouting": True,
    "defaultModel": "Auto",
    "airGapStrict": True,
    "sandboxTimeout": 30,
    "qdrantCollection": "SOPs"
}


@router.get("", summary="Get Application Settings")
def get_settings_config():
    return DEFAULT_SETTINGS


@router.put("", summary="Update Application Settings")
def update_settings_config(settings_in: Dict[str, Any] = Body(...)):
    DEFAULT_SETTINGS.update(settings_in)
    return {"status": "updated", "settings": DEFAULT_SETTINGS}
