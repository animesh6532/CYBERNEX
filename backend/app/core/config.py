import os
from functools import lru_cache
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "CYBERNEX"
    ENVIRONMENT: str = "development"
    DEMO_MODE: bool = False
    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    DATABASE_URL: str = "sqlite:///./storage/cybernex.db"

    QDRANT_URL: str = "http://localhost:6333"
    OLLAMA_URL: str = "http://localhost:11434"

    GENERAL_MODEL: str = "CYBERNEX General (Llama-3-70B)"
    CODING_MODEL: str = "CYBERNEX Code (Qwen2.5-Coder-32B)"
    VISION_MODEL: str = "CYBERNEX Vision (Llama-3.2-Vision)"

    UPLOAD_DIR: str = "./storage/uploads"
    DOCUMENT_DIR: str = "./storage/documents"
    OUTPUT_DIR: str = "./storage/outputs"
    LOG_DIR: str = "./storage/logs"

    JWT_SECRET: str = "cybernex_sovereign_secret_key_change_in_production_32bytes"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    MAX_UPLOAD_SIZE_MB: int = 50
    SANDBOX_TIMEOUT_SECONDS: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def init_storage_dirs(self):
        """Ensure all required local storage directories exist."""
        for path in [self.UPLOAD_DIR, self.DOCUMENT_DIR, self.OUTPUT_DIR, self.LOG_DIR, "./storage"]:
            os.makedirs(os.path.abspath(path), exist_ok=True)


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    settings.init_storage_dirs()
    return settings
