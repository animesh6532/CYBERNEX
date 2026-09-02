from typing import List, Optional
from pydantic import BaseModel
from app.schemas.task import UploadedFileSchema


class ExecutionStepSchema(BaseModel):
    stepIndex: int
    code: str
    title: str
    subtitle: str
    status: str
    duration: Optional[str] = None
    timestamp: Optional[str] = None
    toolUsed: Optional[str] = None
    details: Optional[str] = None

    model_config = {"from_attributes": True}


class ExecutionLogSchema(BaseModel):
    id: str
    timestamp: str
    message: str
    level: str
    category: str


class DeliverableSchema(BaseModel):
    id: str
    name: str
    type: str
    size: str
    status: str
    summary: str
    downloadUrl: Optional[str] = None

    model_config = {"from_attributes": True}


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
    severity: str
    description: str
    evidenceSource: str
    page: int


class RunDetailResponse(BaseModel):
    id: str
    prompt: str
    status: str
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

    model_config = {"from_attributes": True}
