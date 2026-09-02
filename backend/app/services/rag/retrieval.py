from typing import List, Dict, Any
from app.services.rag.qdrant_client import qdrant_service


class RAGRetrievalService:
    def search_knowledge(self, query: str, collection: str = "SOPs", limit: int = 5) -> List[Dict[str, Any]]:
        return qdrant_service.search(collection_name=collection, query_text=query, limit=limit)


rag_retrieval = RAGRetrievalService()
