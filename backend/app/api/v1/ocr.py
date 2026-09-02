from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.security import OCRExtractRequest, OCRExtractResponse
from app.services.ocr.service import ocr_service

router = APIRouter(prefix="/ocr", tags=["OCR"])


@router.post("/extract", response_model=OCRExtractResponse, summary="Extract Text via OCR")
def extract_ocr(req: OCRExtractRequest, db: Session = Depends(get_db)):
    if not req.file_id:
        raise HTTPException(status_code=400, detail="file_id is required for OCR extraction.")

    db_file = db.query(models.TaskFile).filter(models.TaskFile.id == req.file_id).first()
    if not db_file or not db_file.file_path:
        raise HTTPException(status_code=404, detail="Requested file record or path not found.")

    res = ocr_service.extract_text(db_file.file_path)
    return OCRExtractResponse(
        text=res.get("text", ""),
        pages=res.get("pages", 1),
        confidence=res.get("confidence", 0.90),
        source_file_id=req.file_id
    )

