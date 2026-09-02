from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.task import UploadedFileSchema


class ExecutionStepSchema(BaseModel):
    stepIndex: int
    code: str
    title: str
    subtitle: str
    status: str  # pending, in_progress, completed, failed
    duration: Optional[str] = None
    timestamp: Optional[str] = None
    toolUsed: Optional[str] = None
    details: Optional[str] = None

    class Config:
        from_attributes = True


class ExecutionLogSchema(BaseModel):
    id: str
    timestamp: str
    message: str
    level: str  # info, warn, error, success
    category: str  # SYSTEM, ROUTING, OCR, RAG, SANDBOX, VERIFICATION


class DeliverableSchema(BaseModel):
    id: str
    name: str
    type: str  # DOCX, XLSX, PPTX, PY, CSV, PDF
    size: str
    status: str  # Verified, Generating, Draft
    summary: str
    downloadUrl: Optional[str] = None

    class Config:
        from_attributes = True


class CitationSchema(BaseModel):
    id: str
    sourceName: str
    sourceFile: str
    page: int
    section: str
    snippet: str
    confidence: float


class FindingSchema(BaseModel):
    id: str
    title: str
    severity: str  # HIGH, MEDIUM, LOW, CRITICAL
    description: str
    evidenceSource: str
    page: int


class RunDetailResponse(BaseModel):
    id: str
    prompt: str
    status: str  # queued, running, completed, failed, cancelled, waiting
    createdAt: str
    duration: Optional[str] = None
    selectedModel: str
    selectedTools: List[str]
    files: List[UploadedFileSchema] = []
    steps: List[ExecutionStepSchema] = []
    logs: List[ExecutionLogSchema] = []
    citations: List[CitationSchema] = []
    findings: List[FindingSchema] = []
    deliverables: List[DeliverableSchema] = []

    class Config:
        from_attributes = True
