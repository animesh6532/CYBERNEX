from typing import List, Optional
from pydantic import BaseModel


class SecurityStatusSchema(BaseModel):
    externalApiCount: int = 0
    cloudLlmCalls: int = 0
    externalConnections: int = 0
    dataLeavingMachine: int = 0
    airGapStatus: str = "ACTIVE"
    sandboxIsolation: str = "SANDBOXED"
    networkStatus: str = "LOCAL ONLY"
    knowledgeBaseStatus: str = "LOCAL (QDRANT)"


class SystemMetricsSchema(BaseModel):
    gpuUsage: float = 0.0
    cpuUsage: float = 0.0
    memoryUsage: float = 0.0
    storageUsage: float = 0.0
    ragIndexingRate: str = "1,420 chunks/s"
    activeAgents: int = 0
    totalDocuments: int = 0
    totalChunks: int = 0


class OCRExtractRequest(BaseModel):
    file_id: Optional[str] = None
    language: str = "eng"


class OCRExtractResponse(BaseModel):
    text: str
    pages: int
    confidence: float
    source_file_id: str


class SandboxRunRequest(BaseModel):
    code: str
    language: str = "python"
    timeout: int = 30


class SandboxRunResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    duration: str
    status: str  # SUCCESS, TIMEOUT, ERROR
