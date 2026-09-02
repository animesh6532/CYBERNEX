import os
import tempfile
import fitz  # PyMuPDF
from typing import Dict, Any
from app.core.logging import logger

try:
    from paddleocr import PaddleOCR
    PADDLEOCR_AVAILABLE = True
except ImportError:
    PADDLEOCR_AVAILABLE = False


class OCRService:
    def __init__(self):
        self._ocr_engine = None

    def _get_paddle_ocr(self):
        if PADDLEOCR_AVAILABLE and self._ocr_engine is None:
            try:
                self._ocr_engine = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
            except Exception as e:
                logger.error(f"Failed to initialize PaddleOCR: {e}")
                self._ocr_engine = None
        return self._ocr_engine

    def run_paddle_ocr_on_bytes(self, img_bytes: bytes) -> str:
        engine = self._get_paddle_ocr()
        if not engine:
            return "OCR_UNAVAILABLE: PaddleOCR engine not initialized or dependencies missing."

        try:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                tmp.write(img_bytes)
                tmp_path = tmp.name

            try:
                result = engine.ocr(tmp_path, cls=True)
                lines = []
                if result and result[0]:
                    for line in result[0]:
                        if len(line) >= 2 and len(line[1]) >= 1:
                            lines.append(line[1][0])
                return "\n".join(lines) if lines else "OCR_UNAVAILABLE: No text detected."
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        except Exception as e:
            logger.error(f"PaddleOCR error: {e}")
            return f"OCR_UNAVAILABLE: {e}"

    def extract_text(self, file_path: str, min_density_chars: int = 50) -> Dict[str, Any]:
        """
        PyMuPDF text density check -> PaddleOCR page-aware fallback pipeline.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found for OCR: {file_path}")

        ext = file_path.rsplit(".", 1)[-1].lower() if "." in file_path else ""

        if ext == "pdf":
            try:
                doc = fitz.open(file_path)
                text_pages = []
                engine_used = "PyMuPDF"

                for i, page in enumerate(doc):
                    t = page.get_text()
                    # Check text density
                    if len(t.strip()) < min_density_chars:
                        pix = page.get_pixmap()
                        img_bytes = pix.tobytes("png")
                        ocr_text = self.run_paddle_ocr_on_bytes(img_bytes)
                        if "OCR_UNAVAILABLE" not in ocr_text and ocr_text.strip():
                            t = ocr_text
                            engine_used = "PyMuPDF + PaddleOCR"
                        elif not t.strip():
                            t = "OCR_UNAVAILABLE: Page text density insufficient and OCR unavailable."

                    text_pages.append(f"--- Page {i+1} ---\n{t}")

                full_text = "\n\n".join(text_pages)
                return {
                    "text": full_text,
                    "pages": len(doc),
                    "confidence": 0.95 if "OCR_UNAVAILABLE" not in full_text else 0.50,
                    "engine": engine_used
                }
            except Exception as e:
                logger.error(f"PDF OCR failed: {e}")
                return {"text": f"Error parsing PDF: {e}", "pages": 0, "confidence": 0.0, "engine": "Error"}

        elif ext in ["png", "jpg", "jpeg", "webp"]:
            try:
                with open(file_path, "rb") as f:
                    img_bytes = f.read()
                ocr_text = self.run_paddle_ocr_on_bytes(img_bytes)
                return {
                    "text": ocr_text,
                    "pages": 1,
                    "confidence": 0.90 if "OCR_UNAVAILABLE" not in ocr_text else 0.0,
                    "engine": "PaddleOCR" if PADDLEOCR_AVAILABLE else "OCR_UNAVAILABLE"
                }
            except Exception as e:
                logger.error(f"Image OCR failed: {e}")
                return {"text": f"Error parsing image: {e}", "pages": 1, "confidence": 0.0, "engine": "Error"}

        else:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                return {"text": content, "pages": 1, "confidence": 1.0, "engine": "TextReader"}
            except Exception as e:
                return {"text": f"Error reading file: {e}", "pages": 0, "confidence": 0.0, "engine": "Error"}


ocr_service = OCRService()

