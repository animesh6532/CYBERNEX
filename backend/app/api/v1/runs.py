import asyncio
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.run import RunDetailResponse, ExecutionStepSchema, DeliverableSchema, UploadedFileSchema, CitationSchema, FindingSchema

router = APIRouter(prefix="/runs", tags=["Agent Execution Runs"])


@router.get("", summary="List All Runs")
def list_runs(db: Session = Depends(get_db)):
    runs = db.query(models.Run).order_by(models.Run.started_at.desc()).all()
    return [{"id": r.id, "task_id": r.task_id, "status": r.status, "model": r.selected_model, "started_at": r.started_at} for r in runs]


@router.get("/{run_id}", response_model=RunDetailResponse, summary="Get Agent Execution Detail")
def get_run(run_id: str, db: Session = Depends(get_db)):
    run = db.query(models.Run).filter(models.Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run execution ID not found.")

    task = db.query(models.Task).filter(models.Task.id == run.task_id).first()
    prompt = task.prompt if task else "User Execution Task"
    selected_tools = task.selected_tools if task else []

    files = [
        UploadedFileSchema(id=f.id, name=f.original_name, size=f.size_formatted, type=f.file_type, status=f.status)
        for f in (task.files if task else [])
    ]

    steps_schemas = [
        ExecutionStepSchema(
            stepIndex=s.step_index,
            code=s.code,
            title=s.title,
            subtitle=s.subtitle,
            status=s.status,
            duration=s.duration,
            timestamp=s.timestamp,
            toolUsed=s.tool_used,
            details=s.details
        ) for s in run.steps
    ]

    deliverables_schemas = [
        DeliverableSchema(
            id=d.id,
            name=d.name,
            type=d.file_type,
            size=d.size,
            status=d.status,
            summary=d.summary or "",
            downloadUrl=d.download_url
        ) for d in run.deliverables
    ]

    # Citations & Findings are empty unless generated during execution
    citations = []
    findings = []

    return RunDetailResponse(
        id=run.id,
        prompt=prompt,
        status=run.status,
        createdAt=run.started_at,
        duration=run.duration or "1.2s",
        selectedModel=run.selected_model,
        selectedTools=selected_tools,
        files=files,
        steps=steps_schemas,
        logs=[],
        citations=citations,
        findings=findings,
        deliverables=deliverables_schemas
    )


@router.get("/{run_id}/steps", response_model=List[ExecutionStepSchema], summary="Get Run Steps")
def get_run_steps(run_id: str, db: Session = Depends(get_db)):
    steps = db.query(models.RunStep).filter(models.RunStep.run_id == run_id).order_by(models.RunStep.step_index).all()
    return [
        ExecutionStepSchema(
            stepIndex=s.step_index,
            code=s.code,
            title=s.title,
            subtitle=s.subtitle,
            status=s.status,
            duration=s.duration,
            timestamp=s.timestamp,
            toolUsed=s.tool_used,
            details=s.details
        ) for s in steps
    ]


@router.get("/{run_id}/events", summary="Stream Run Progress Events (SSE)")
async def stream_run_events(run_id: str, db: Session = Depends(get_db)):
    async def event_generator():
        run = db.query(models.Run).filter(models.Run.id == run_id).first()
        if not run:
            data = json.dumps({"event": "run.failed", "run_id": run_id, "error": "Run not found"})
            yield f"data: {data}\n\n"
            return

        steps = db.query(models.RunStep).filter(models.RunStep.run_id == run_id).order_by(models.RunStep.step_index).all()
        for step in steps:
            data = json.dumps({
                "event": "step.completed",
                "run_id": run_id,
                "stepIndex": step.step_index,
                "title": step.title,
                "status": step.status
            })
            yield f"data: {data}\n\n"

        final_data = json.dumps({
            "event": "run.completed" if run.status == "completed" else f"run.{run.status}",
            "run_id": run_id,
            "status": run.status
        })
        yield f"data: {final_data}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/{run_id}/cancel", summary="Cancel Run Execution")
def cancel_run(run_id: str, db: Session = Depends(get_db)):
    run = db.query(models.Run).filter(models.Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found.")
    run.status = "cancelled"
    db.commit()
    return {"message": f"Run {run_id} has been cancelled."}

