import os
import fitz  # PyMuPDF
from typing import Dict, Any
from app.core.logging import logger

try:
    import docx
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False


class DocumentParser:
    def parse_document(self, file_path: str) -> Dict[str, Any]:
        """
        Parses document content into text and metadata.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Document path invalid: {file_path}")

        filename = os.path.basename(file_path)
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

        if ext == "pdf":
            doc = fitz.open(file_path)
            pages_text = [page.get_text() for page in doc]
            full_text = "\n".join(pages_text)
            return {
                "name": filename,
                "type": "PDF",
                "text": full_text,
                "pages": len(doc),
                "size_formatted": f"{round(os.path.getsize(file_path) / (1024*1024), 1)} MB"
            }

        elif ext in ["docx", "doc"] and DOCX_AVAILABLE:
            try:
                doc = docx.Document(file_path)
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                full_text = "\n".join(paragraphs)
                return {
                    "name": filename,
                    "type": "DOCX",
                    "text": full_text,
                    "pages": max(1, len(paragraphs) // 10),
                    "size_formatted": f"{round(os.path.getsize(file_path) / (1024*1024), 1)} MB"
                }
            except Exception as e:
                logger.error(f"Docx parsing error: {e}")

        # Fallback text file reading
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()

        return {
            "name": filename,
            "type": ext.upper() or "TXT",
            "text": text,
            "pages": 1,
            "size_formatted": f"{round(os.path.getsize(file_path) / 1024, 1)} KB"
        }


doc_parser = DocumentParser()
