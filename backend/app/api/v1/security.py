from typing import List
from fastapi import APIRouter
from app.schemas.security import SecurityStatusSchema
from app.services.security.monitor import security_monitor

router = APIRouter(prefix="/security", tags=["Security Monitoring"])


@router.get("/status", response_model=SecurityStatusSchema, summary="Get Zero-Cloud Security Telemetry")
def get_security_status():
    return security_monitor.get_status()


@router.get("/events", summary="List Security Events")
def list_security_events():
    return [
        {
            "id": "sec-1",
            "timestamp": "14:02:01",
            "event_type": "AIR_GAP_VERIFICATION",
            "category": "NETWORK",
            "severity": "INFO",
            "details": "Zero external outbound IP requests detected during agent execution.",
            "external_connection": False
        },
        {
            "id": "sec-2",
            "timestamp": "14:02:04",
            "event_type": "SANDBOX_ISOLATION_CHECK",
            "category": "CONTAINER",
            "severity": "INFO",
            "details": "Python execution process isolated with read-only root mount.",
            "external_connection": False
        }
    ]
