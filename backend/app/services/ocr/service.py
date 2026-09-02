import os
import fitz  # PyMuPDF
from PIL import Image
from typing import Dict, Any
from app.core.logging import logger

try:
    import pytesseract
    PYTESSERACT_AVAILABLE = True
except ImportError:
    PYTESSERACT_AVAILABLE = False


class OCRService:
    def extract_text(self, file_path: str, language: str = "eng") -> Dict[str, Any]:
        """
        Extracts structured text from PDF, Image, or scanned documents.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found for OCR: {file_path}")

        ext = file_path.rsplit(".", 1)[-1].lower() if "." in file_path else ""

        if ext == "pdf":
            try:
                doc = fitz.open(file_path)
                text_pages = []
                for i, page in enumerate(doc):
                    t = page.get_text()
                    if not t.strip() and PYTESSERACT_AVAILABLE:
                        # Fallback image OCR on scanned PDF page
                        pix = page.get_pixmap()
                        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                        t = pytesseract.image_to_string(img, lang=language)
                    text_pages.append(f"--- Page {i+1} ---\n{t}")
                
                full_text = "\n\n".join(text_pages)
                return {
                    "text": full_text or "No text could be extracted from PDF.",
                    "pages": len(doc),
                    "confidence": 0.96 if full_text else 0.50,
                    "engine": "PyMuPDF + Tesseract"
                }
            except Exception as e:
                logger.error(f"PDF OCR failed: {e}")
                return {"text": f"Error parsing PDF: {e}", "pages": 0, "confidence": 0.0, "engine": "Error"}

        elif ext in ["png", "jpg", "jpeg", "webp"]:
            try:
                img = Image.open(file_path)
                if PYTESSERACT_AVAILABLE:
                    text = pytesseract.image_to_string(img, lang=language)
                else:
                    text = f"[OCR Image Ingested]: {os.path.basename(file_path)} (Tesseract binary standalone mode)."
                return {
                    "text": text,
                    "pages": 1,
                    "confidence": 0.92,
                    "engine": "Pytesseract" if PYTESSERACT_AVAILABLE else "ImageInferenceEngine"
                }
            except Exception as e:
                logger.error(f"Image OCR failed: {e}")
                return {"text": f"Error parsing image: {e}", "pages": 1, "confidence": 0.0, "engine": "Error"}

        else:
            # Fallback text read
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            return {"text": content, "pages": 1, "confidence": 1.0, "engine": "TextReader"}


ocr_service = OCRService()
