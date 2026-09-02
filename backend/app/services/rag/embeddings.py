from typing import List
from app.core.config import get_settings
from app.core.logging import logger

settings = get_settings()

_embedding_instance = None


def get_embedding_model():
    global _embedding_instance
    if _embedding_instance is None:
        try:
            from fastembed import TextEmbedding
            _embedding_instance = TextEmbedding(model_name=settings.EMBEDDING_MODEL)
            logger.info(f"Initialized fastembed model: {settings.EMBEDDING_MODEL}")
        except Exception as e:
            logger.warning(f"Failed to load fastembed model ({e}). Local embeddings will be unavailable.")
            _embedding_instance = None
    return _embedding_instance


def embed_texts(texts: List[str]) -> List[List[float]]:
    model = get_embedding_model()
    if not model:
        return []
    try:
        embeddings = list(model.embed(texts))
        return [e.tolist() for e in embeddings]
    except Exception as e:
        logger.error(f"Error computing text embeddings: {e}")
        return []


def embed_query(query: str) -> List[float]:
    res = embed_texts([query])
    return res[0] if res else []


def get_vector_dimension() -> int:
    # BAAI/bge-small-en-v1.5 has dimension 384
    return 384
