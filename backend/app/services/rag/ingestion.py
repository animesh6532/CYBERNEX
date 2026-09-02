import os
import uuid
from typing import List, Dict, Any
from app.services.ocr.service import ocr_service
from app.services.rag.qdrant_client import qdrant_service
from app.core.logging import logger


class RAGIngestionService:
    def chunk_text(self, text: str, chunk_size: int = 300, overlap: int = 30) -> List[str]:
        words = text.split()
        if not words:
            return []
        chunks = []
        step = max(1, chunk_size - overlap)
        for i in range(0, len(words), step):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    def ingest_file(self, file_path: str, collection_name: str = "Reports", doc_id: str = None) -> Dict[str, Any]:
        """
        Processes document -> OCR/Text -> Chunking -> Vector Indexing in Qdrant.
        """
        if not doc_id:
            doc_id = f"doc-{uuid.uuid4().hex[:8]}"

        filename = os.path.basename(file_path)
        logger.info(f"Ingesting file {file_path} into Qdrant collection '{collection_name}'")

        ocr_res = ocr_service.extract_text(file_path)
        text = ocr_res.get("text", "")
        chunks = self.chunk_text(text)

        indexed = False
        if chunks and qdrant_service.health_check():
            indexed = qdrant_service.upsert_chunks(
                collection_name=collection_name,
                chunks=chunks,
                document_id=doc_id,
                filename=filename
            )

        status = "Indexed" if indexed else ("Failed" if text else "Processing")

        return {
            "doc_id": doc_id,
            "filename": filename,
            "file_path": file_path,
            "collection": collection_name,
            "chunks_count": len(chunks),
            "status": status,
            "preview_text": chunks[0][:300] if chunks else (text[:300] if text else "")
        }


rag_ingestion = RAGIngestionService()

