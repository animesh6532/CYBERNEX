from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any, List, Optional


class BaseModelProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, model_name: str, options: Optional[Dict[str, Any]] = None) -> str:
        pass

    @abstractmethod
    async def stream(self, prompt: str, model_name: str, options: Optional[Dict[str, Any]] = None) -> AsyncGenerator[str, None]:
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        pass

    @abstractmethod
    async def list_models(self) -> List[Dict[str, Any]]:
        pass
