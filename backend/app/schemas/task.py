from typing import List, Optional
from pydantic import BaseModel, Field


class UploadedFileSchema(BaseModel):
    id: str
    name: str
    size: str
    type: str  # PDF, DOCX, XLSX, IMAGE, CODE
    pages: Optional[int] = 1
    status: str = "Ready"
    contentSummary: Optional[str] = None

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    prompt: str = Field(..., min_length=1)
    model: str = "Auto"
    tools: List[str] = Field(default_factory=lambda: ["OCR", "Knowledge", "Documents"])
    file_ids: List[str] = Field(default_factory=list)


class TaskResponse(BaseModel):
    id: str
    prompt: str
    status: str
    createdAt: str
    selectedModel: str
    selectedTools: List[str]
    files: List[UploadedFileSchema] = []
    run_id: Optional[str] = None

    model_config = {"from_attributes": True}
