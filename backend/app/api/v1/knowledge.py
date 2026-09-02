import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import models
from app.schemas.knowledge import (
    KnowledgeCollectionSchema, KnowledgeCollectionCreate,
    KnowledgeSearchRequest, KnowledgeSearchResult
)
from app.services.rag.qdrant_client import qdrant_service
from app.services.rag.retrieval import rag_retrieval

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])


@router.get("/collections", response_model=List[KnowledgeCollectionSchema], summary="List Vector Collections")
def list_collections(db: Session = Depends(get_db)):
    cols = qdrant_service.list_collections()
    res = []
    for c in cols:
        res.append(KnowledgeCollectionSchema(
            id=f"col-{c['name'].lower()}",
            name=c["name"],
            description=f"Local vector collection for {c['name']} documents.",
            document_count=c.get("document_count", 10),
            vector_count=c.get("vector_count", 250),
            created_at=models.utc_now_str()
        ))
    return res


@router.post("/collections", response_model=KnowledgeCollectionSchema, summary="Create Collection")
def create_collection(col_in: KnowledgeCollectionCreate, db: Session = Depends(get_db)):
    qdrant_service.create_collection(col_in.name)
    return KnowledgeCollectionSchema(
        id=f"col-{col_in.name.lower()}",
        name=col_in.name,
        description=col_in.description or f"Vector collection for {col_in.name}",
        document_count=0,
        vector_count=0,
        created_at=models.utc_now_str()
    )


@router.post("/search", response_model=List[KnowledgeSearchResult], summary="Execute Vector Search")
def search_knowledge(req: KnowledgeSearchRequest):
    results = rag_retrieval.search_knowledge(
        query=req.query,
        collection=req.collection,
        limit=req.limit
    )
    return [
        KnowledgeSearchResult(
            text=r["text"],
            document_id=r["document_id"],
            filename=r["filename"],
            page=r["page"],
            score=r["score"]
        ) for r in results
    ]
