from typing import List, Dict, Any
from app.services.ocr.service import ocr_service
from app.services.rag.qdrant_client import qdrant_service
from app.core.logging import logger


class RAGIngestionService:
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks or [text]

    def ingest_file(self, file_path: str, collection_name: str = "Reports") -> Dict[str, Any]:
        """
        Processes document -> OCR/Text -> Chunking -> Vector Indexing.
        """
        logger.info(f"Ingesting file {file_path} into collection {collection_name}")
        ocr_res = ocr_service.extract_text(file_path)
        text = ocr_res.get("text", "")
        chunks = self.chunk_text(text)

        # Ensure collection exists
        qdrant_service.create_collection(collection_name)

        return {
            "file_path": file_path,
            "collection": collection_name,
            "chunks_count": len(chunks),
            "status": "Indexed",
            "preview_text": chunks[0][:200] if chunks else ""
        }


rag_ingestion = RAGIngestionService()
