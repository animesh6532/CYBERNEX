import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.task import TaskCreate, TaskResponse, UploadedFileSchema
from app.services.agent.orchestrator import agent_orchestrator
from app.api.deps import get_current_user_optional

router = APIRouter(prefix="/tasks", tags=["Workbench & Tasks"])


@router.post("", summary="Create Task")
async def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user_optional)
):
    if not task_in.prompt or not task_in.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task prompt cannot be empty."
        )

    task_id = f"task-{uuid.uuid4().hex[:8]}"
    db_task = models.Task(
        id=task_id,
        user_id=user.id if user else None,
        prompt=task_in.prompt.strip(),
        selected_model=task_in.model,
        selected_tools_json=models.json.dumps(task_in.tools),
        status="queued"
    )
    db.add(db_task)

    # Attach any specified file_ids
    if task_in.file_ids:
        files = db.query(models.TaskFile).filter(models.TaskFile.id.in_(task_in.file_ids)).all()
        for f in files:
            f.task_id = task_id

    db.commit()
    db.refresh(db_task)

    # Initialize execution run
    run = agent_orchestrator.create_run_for_task(db, db_task)

    return {
        "task_id": db_task.id,
        "run_id": run.id,
        "status": "created",
        "message": "Task created and agent execution pipeline initialized."
    }


@router.get("", summary="List Tasks")
def list_tasks(
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user_optional)
):
    query = db.query(models.Task)
    if user:
        query = query.filter(models.Task.user_id == user.id)
    tasks = query.order_by(models.Task.created_at.desc()).all()

    res = []
    for t in tasks:
        res.append({
            "id": t.id,
            "prompt": t.prompt,
            "status": t.status,
            "createdAt": t.created_at,
            "selectedModel": t.selected_model,
            "selectedTools": t.selected_tools,
            "run_id": t.run_id
        })
    return res


@router.get("/{task_id}", summary="Get Task Details")
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found."
        )

    file_schemas = [
        UploadedFileSchema(
            id=f.id,
            name=f.original_name,
            size=f.size_formatted,
            type=f.file_type,
            status=f.status
        ) for f in task.files
    ]

    return {
        "id": task.id,
        "prompt": task.prompt,
        "status": task.status,
        "createdAt": task.created_at,
        "selectedModel": task.selected_model,
        "selectedTools": task.selected_tools,
        "files": file_schemas,
        "run_id": task.run_id
    }
