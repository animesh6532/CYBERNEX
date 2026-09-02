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
    if not docs:
        # Seed default document items
        defaults = [
            models.Document(
                id="doc-1",
                name="Inspection_SOP.pdf",
                type="PDF",
                collection_name="SOPs",
                chunks_count=284,
                status="Indexed",
                size="8.1 MB",
                updated_at="2026-08-28",
                preview_text="SOP-704: Industrial Machinery Tolerance Thresholds & Compliance Verification guidelines for enterprise turbines, pumps, and high-pressure valves."
            ),
            models.Document(
                id="doc-2",
                name="Safety_Manual_2026.pdf",
                type="PDF",
                collection_name="Manuals",
                chunks_count=421,
                status="Indexed",
                size="14.5 MB",
                updated_at="2026-08-15",
                preview_text="Comprehensive plant safety regulations, emergency shutdown sequences, containment procedures, and high-voltage isolation standards."
            ),
            models.Document(
                id="doc-3",
                name="Plant_Quarterly_Report_Q2.pdf",
                type="PDF",
                collection_name="Reports",
                chunks_count=187,
                status="Indexed",
                size="5.2 MB",
                updated_at="2026-07-30",
                preview_text="Performance summary of heavy manufacturing assets across North Operations, including efficiency ratings and maintenance logs."
            ),
            models.Document(
                id="doc-4",
                name="Cybersecurity_AirGap_Policy.pdf",
                type="PDF",
                collection_name="Policies",
                chunks_count=96,
                status="Indexed",
                size="2.4 MB",
                updated_at="2026-08-01",
                preview_text="Strict network isolation protocols, zero cloud inference mandates, local hardware key authorization, and encrypted audit logging."
            ),
        ]
        db.add_all(defaults)
        db.commit()
        docs = defaults

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
