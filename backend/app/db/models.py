from datetime import datetime, timezone
import json
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


def utc_now_str():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="Operator")
    is_active = Column(Boolean, default=True)
    created_at = Column(String, default=utc_now_str)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    prompt = Column(Text, nullable=False)
    selected_model = Column(String, default="Auto")
    selected_tools_json = Column(Text, default="[]")
    status = Column(String, default="queued")  # queued, running, completed, failed, cancelled
    created_at = Column(String, default=utc_now_str)
    updated_at = Column(String, default=utc_now_str)
    run_id = Column(String, nullable=True)
    result_id = Column(String, nullable=True)

    files = relationship("TaskFile", back_populates="task", cascade="all, delete-orphan")
    runs = relationship("Run", back_populates="task", cascade="all, delete-orphan")

    @property
    def selected_tools(self):
        try:
            return json.loads(self.selected_tools_json)
        except Exception:
            return []

    @selected_tools.setter
    def selected_tools(self, val):
        self.selected_tools_json = json.dumps(val)


class TaskFile(Base):
    __tablename__ = "task_files"

    id = Column(String, primary_key=True, index=True)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    original_name = Column(String, nullable=False)
    stored_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # PDF, DOCX, XLSX, IMAGE, CODE, etc.
    size_bytes = Column(Integer, default=0)
    size_formatted = Column(String, default="0 MB")
    mime_type = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    status = Column(String, default="Ready")

    task = relationship("Task", back_populates="files")


class Run(Base):
    __tablename__ = "runs"

    id = Column(String, primary_key=True, index=True)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    status = Column(String, default="queued")  # queued, running, completed, failed, cancelled
    selected_model = Column(String, default="Auto")
    started_at = Column(String, default=utc_now_str)
    completed_at = Column(String, nullable=True)
    duration = Column(String, nullable=True)

    task = relationship("Task", back_populates="runs")
    steps = relationship("RunStep", back_populates="run", cascade="all, delete-orphan", order_by="RunStep.step_index")
    deliverables = relationship("GeneratedOutput", back_populates="run", cascade="all, delete-orphan")


class RunStep(Base):
    __tablename__ = "run_steps"

    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("runs.id"), nullable=False)
    step_index = Column(Integer, nullable=False)
    code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, in_progress, completed, failed
    duration = Column(String, nullable=True)
    timestamp = Column(String, default=utc_now_str)
    tool_used = Column(String, nullable=True)
    details = Column(Text, nullable=True)

    run = relationship("Run", back_populates="steps")


class Model(Base):
    __tablename__ = "models"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    category = Column(String, nullable=False)  # GENERAL, CODING, VISION, EMBEDDING
    status = Column(String, default="ONLINE")  # ONLINE, OFFLINE, BUSY
    local_inference = Column(Boolean, default=True)
    context_window = Column(String, default="128,000 tokens")
    vram_usage = Column(String, default="0.0 GB")
    gpu_load = Column(Integer, default=0)
    throughput = Column(String, default="0 t/s")
    last_check = Column(String, default=utc_now_str)


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # PDF, DOCX, XLSX, TXT, IMAGE
    collection_name = Column(String, default="Reports")
    chunks_count = Column(Integer, default=0)
    status = Column(String, default="Indexed")  # Indexed, Processing, Failed
    size = Column(String, default="0 MB")
    updated_at = Column(String, default=utc_now_str)
    preview_text = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)


class KnowledgeCollection(Base):
    __tablename__ = "knowledge_collections"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    document_count = Column(Integer, default=0)
    vector_count = Column(Integer, default=0)
    created_at = Column(String, default=utc_now_str)


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, default=utc_now_str)
    event_type = Column(String, nullable=False)
    category = Column(String, default="SYSTEM")
    severity = Column(String, default="INFO")
    details = Column(Text, nullable=True)
    external_connection = Column(Boolean, default=False)


class SystemSnapshot(Base):
    __tablename__ = "system_snapshots"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, default=utc_now_str)
    cpu_usage = Column(Float, default=0.0)
    memory_usage = Column(Float, default=0.0)
    gpu_usage = Column(Float, default=0.0)
    storage_usage = Column(Float, default=0.0)
    active_agents = Column(Integer, default=0)


class GeneratedOutput(Base):
    __tablename__ = "generated_outputs"

    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("runs.id"), nullable=True)
    name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # DOCX, XLSX, PPTX, PY, CSV, PDF
    size = Column(String, default="0 KB")
    status = Column(String, default="Verified")
    summary = Column(Text, nullable=True)
    download_url = Column(String, nullable=True)
    file_path = Column(String, nullable=True)

    run = relationship("Run", back_populates="deliverables")
