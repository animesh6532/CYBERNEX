from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas.security import SecurityStatusSchema
from app.services.security.monitor import security_monitor

router = APIRouter(prefix="/security", tags=["Security Monitoring"])


@router.get("/status", response_model=SecurityStatusSchema, summary="Get Zero-Cloud Security Telemetry")
def get_security_status():
    return security_monitor.get_status()


@router.get("/events", summary="List Security Events")
def list_security_events(db: Session = Depends(get_db)):
    events = db.query(models.SecurityEvent).order_by(models.SecurityEvent.timestamp.desc()).all()
    return [
        {
            "id": e.id,
            "timestamp": e.timestamp,
            "event_type": e.event_type,
            "category": e.category,
            "severity": e.severity,
            "details": e.details,
            "external_connection": e.external_connection
        }
        for e in events
    ]


