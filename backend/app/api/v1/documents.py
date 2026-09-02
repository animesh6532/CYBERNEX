import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.knowledge import DocumentSchema
from app.services.documents.generator import doc_generator

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("", response_model=List[DocumentSchema], summary="List Documents")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(models.Document).all()
    return [
        DocumentSchema(
            id=d.id,
            name=d.name,
            type=d.type,
            collection=d.collection_name,
            chunks=d.chunks_count,
            status=d.status,
            size=d.size,
            updatedAt=d.updated_at,
            previewText=d.preview_text
        ) for d in docs
    ]



@router.get("/{doc_id}", response_model=DocumentSchema, summary="Get Document Details")
def get_document(doc_id: str, db: Session = Depends(get_db)):
    d = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Document not found.")
    return DocumentSchema(
        id=d.id,
        name=d.name,
        type=d.type,
        collection=d.collection_name,
        chunks=d.chunks_count,
        status=d.status,
        size=d.size,
        updatedAt=d.updated_at,
        previewText=d.preview_text
    )


@router.get("/{doc_id}/download", summary="Download Generated Document")
def download_document(doc_id: str, db: Session = Depends(get_db)):
    out = db.query(models.GeneratedOutput).filter(models.GeneratedOutput.id == doc_id).first()
    if out and out.file_path and os.path.exists(out.file_path):
        return FileResponse(
            path=out.file_path,
            filename=out.name,
            media_type="application/octet-stream"
        )
    raise HTTPException(status_code=404, detail="Requested deliverable file not found on disk.")
