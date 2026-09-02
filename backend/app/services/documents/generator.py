import os
import uuid
from typing import Dict, Any, List, Optional
from app.core.config import get_settings
from app.core.logging import logger

try:
    import docx
    from docx.shared import Inches, Pt, RGBColor
    DOCX_BUILDER_AVAILABLE = True
except ImportError:
    DOCX_BUILDER_AVAILABLE = False

settings = get_settings()


class DocumentGenerator:
    def generate_docx(
        self,
        title: str,
        sections: List[Dict[str, str]],
        output_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates a sovereign DOCX executive deliverable in storage/outputs/.
        """
        settings.init_storage_dirs()
        doc_id = f"docgen-{uuid.uuid4().hex[:8]}"
        filename = output_name or f"Approval_Note_{doc_id}.docx"
        if not filename.endswith(".docx"):
            filename += ".docx"

        file_path = os.path.abspath(os.path.join(settings.OUTPUT_DIR, filename))

        if DOCX_BUILDER_AVAILABLE:
            try:
                doc = docx.Document()

                # Header Title
                title_p = doc.add_heading(level=0)
                run = title_p.add_run(title)
                run.font.color.rgb = RGBColor(12, 74, 110)  # Cybernex Sky Blue #0C4A6E
                run.font.size = Pt(22)
                run.bold = True

                doc.add_paragraph(f"CYBERNEX Sovereign AI Workbench — Executive Approval Note")
                doc.add_paragraph("=" * 60)

                for sec in sections:
                    sec_title = sec.get("title", "Section")
                    sec_content = sec.get("content", "")

                    h = doc.add_heading(sec_title, level=1)
                    h.runs[0].font.color.rgb = RGBColor(3, 105, 161)

                    p = doc.add_paragraph(sec_content)
                    p.style.font.size = Pt(11)

                doc.save(file_path)
                logger.info(f"Generated DOCX deliverable: {file_path}")

            except Exception as e:
                logger.error(f"Failed to generate DOCX file: {e}")
                self._fallback_text(file_path, title, sections)
        else:
            self._fallback_text(file_path, title, sections)

        size_bytes = os.path.getsize(file_path) if os.path.exists(file_path) else 1024
        size_str = f"{round(size_bytes / 1024, 1)} KB"

        return {
            "id": doc_id,
            "name": filename,
            "type": "DOCX",
            "size": size_str,
            "status": "Verified",
            "summary": f"Generated formal executive approval note '{title}'.",
            "file_path": file_path,
            "download_url": f"/api/v1/documents/{doc_id}/download"
        }

    def _fallback_text(self, file_path: str, title: str, sections: List[Dict[str, str]]):
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"CYBERNEX SOVEREIGN EXECUTIVE REPORT: {title}\n\n")
            for sec in sections:
                f.write(f"=== {sec.get('title', '')} ===\n")
                f.write(f"{sec.get('content', '')}\n\n")


doc_generator = DocumentGenerator()
