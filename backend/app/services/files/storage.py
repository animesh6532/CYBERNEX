import os
import uuid
import shutil
from typing import Tuple
from fastapi import UploadFile
from app.core.config import get_settings
from app.core.logging import logger

settings = get_settings()

ALLOWED_EXTENSIONS = {
    "pdf", "docx", "xlsx", "pptx", "png", "jpg", "jpeg", "txt", "csv", "py", "js", "ts"
}


def is_allowed_file(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in ALLOWED_EXTENSIONS


def get_file_type(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext in ["pdf"]:
        return "PDF"
    elif ext in ["docx", "doc"]:
        return "DOCX"
    elif ext in ["xlsx", "xls"]:
        return "XLSX"
    elif ext in ["png", "jpg", "jpeg", "webp"]:
        return "IMAGE"
    elif ext in ["py", "js", "ts", "json", "csv"]:
        return "CODE"
    return "DOCUMENT"


def save_upload_file(upload_file: UploadFile) -> Tuple[str, str, str, int, str]:
    """
    Saves an uploaded file to storage/uploads/ with a unique safe filename.
    Returns: (file_id, original_name, stored_name, size_bytes, file_path)
    """
    settings.init_storage_dirs()
    filename = upload_file.filename or "file.bin"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"

    file_id = f"file-{uuid.uuid4().hex[:12]}"
    stored_name = f"{file_id}.{ext}"
    file_path = os.path.abspath(os.path.join(settings.UPLOAD_DIR, stored_name))

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    size_bytes = os.path.getsize(file_path)
    logger.info(f"Saved file {filename} ({size_bytes} bytes) to {file_path}")

    return file_id, filename, stored_name, size_bytes, file_path
