import asyncio
import time
import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.db import models
from app.services.agent.graph import agent_graph, AgentState
from app.core.logging import logger


class AgentOrchestrator:
    def create_run_for_task(self, db: Session, task: models.Task) -> models.Run:
        """
        Creates and initializes a new LangGraph execution Run for a Task.
        """
        run_id = f"run-{uuid.uuid4().hex[:6]}-cx"
        files_data = [
            {
                "file_type": f.file_type,
                "original_name": f.original_name,
                "file_path": f.file_path
            }
            for f in task.files
        ]

        # Initial state for LangGraph execution
        initial_state: AgentState = {
            "task_id": task.id,
            "run_id": run_id,
            "prompt": task.prompt,
            "selected_model": task.selected_model,
            "selected_tools": task.selected_tools,
            "files": files_data,
            "task_understanding": "",
            "plan_steps": [],
            "model_routed": task.selected_model,
            "retrieved_chunks": [],
            "ocr_text": "",
            "execution_result": "",
            "verification_status": "Pending",
            "deliverable": None,
            "current_step": 0,
            "step_events": []
        }

        # Invoke LangGraph pipeline
        final_state = agent_graph.invoke(initial_state)

        selected_model = final_state.get("model_routed") or task.selected_model

        run = models.Run(
            id=run_id,
            task_id=task.id,
            status="completed",
            selected_model=selected_model,
            started_at=models.utc_now_str(),
            completed_at=models.utc_now_str(),
            duration="1.2s"
        )
        db.add(run)

        # Store steps from LangGraph execution
        step_events = final_state.get("step_events", [])
        for evt in step_events:
            db_step = models.RunStep(
                id=f"step-{run_id}-{evt['step_index']}",
                run_id=run_id,
                step_index=evt["step_index"],
                code=evt["code"],
                title=evt["title"],
                subtitle=evt["subtitle"],
                status=evt["status"],
                tool_used=evt.get("tool_used"),
                details=evt.get("details"),
                timestamp=models.utc_now_str()
            )
            db.add(db_step)

        # Store deliverable output if generated
        deliv = final_state.get("deliverable")
        if deliv:
            db_deliv = models.GeneratedOutput(
                id=deliv["id"],
                run_id=run_id,
                name=deliv["name"],
                file_type=deliv["type"],
                size=deliv["size"],
                status=deliv["status"],
                summary=deliv["summary"],
                download_url=deliv["download_url"],
                file_path=deliv["file_path"]
            )
            db.add(db_deliv)

        # Add security audit event for run start & completion
        db_sec = models.SecurityEvent(
            id=f"sec-{uuid.uuid4().hex[:6]}",
            timestamp=models.utc_now_str(),
            event_type="AGENT_RUN_COMPLETED",
            category="ORCHESTRATOR",
            severity="INFO",
            details=f"LangGraph execution run '{run_id}' completed for task '{task.id}'.",
            external_connection=False
        )
        db.add(db_sec)

        task.status = "completed"
        task.run_id = run_id
        db.commit()
        db.refresh(run)

        logger.info(f"LangGraph agent execution run {run_id} completed successfully for task {task.id}")
        return run


agent_orchestrator = AgentOrchestrator()

