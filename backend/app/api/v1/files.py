import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.services.files.storage import save_upload_file, is_allowed_file, get_file_type
from app.schemas.task import UploadedFileSchema

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/upload", response_model=UploadedFileSchema, summary="Upload Confidential File")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename or not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension for '{file.filename}' is not supported."
        )

    file_id, original_name, stored_name, size_bytes, file_path = save_upload_file(file)
    file_type = get_file_type(original_name)
    size_formatted = f"{round(size_bytes / (1024 * 1024), 1)} MB" if size_bytes >= 1024*1024 else f"{round(size_bytes / 1024, 1)} KB"

    db_file = models.TaskFile(
        id=file_id,
        task_id=None,
        original_name=original_name,
        stored_name=stored_name,
        file_type=file_type,
        size_bytes=size_bytes,
        size_formatted=size_formatted,
        mime_type=file.content_type,
        file_path=file_path,
        status="Ready"
    )
    db.add(db_file)
    db.commit()


    return UploadedFileSchema(
        id=file_id,
        name=original_name,
        size=size_formatted,
        type=file_type,
        status="Ready"
    )


@router.get("/{file_id}", response_model=UploadedFileSchema, summary="Get File Metadata")
def get_file(file_id: str, db: Session = Depends(get_db)):
    db_file = db.query(models.TaskFile).filter(models.TaskFile.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found.")

    return UploadedFileSchema(
        id=db_file.id,
        name=db_file.original_name,
        size=db_file.size_formatted,
        type=db_file.file_type,
        status=db_file.status
    )


@router.delete("/{file_id}", summary="Delete File")
def delete_file(file_id: str, db: Session = Depends(get_db)):
    db_file = db.query(models.TaskFile).filter(models.TaskFile.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found.")

    if os.path.exists(db_file.file_path):
        try:
            os.remove(db_file.file_path)
        except Exception:
            pass

    db.delete(db_file)
    db.commit()
    return {"message": f"File '{db_file.original_name}' deleted."}
