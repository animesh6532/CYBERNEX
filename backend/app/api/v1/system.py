from fastapi import APIRouter
from app.schemas.security import SystemMetricsSchema
from app.services.system.monitor import system_monitor

router = APIRouter(prefix="/system", tags=["System Monitoring"])


@router.get("/status", response_model=SystemMetricsSchema, summary="Get System Hardware Status")
def get_system_status():
    return system_monitor.get_status()
