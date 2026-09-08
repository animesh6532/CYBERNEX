from app.core.egress_tracker import egress_tracker
from app.schemas.security import SecurityStatusSchema
from app.services.models.ollama_client import OllamaProvider
from app.services.rag.qdrant_client import qdrant_service
from app.services.sandbox.executor import DOCKER_AVAILABLE


class SecurityMonitorService:
    async def get_status(self) -> SecurityStatusSchema:
        """
        Returns authentic local-first security telemetry metrics.
        """
        ollama_reachable = await OllamaProvider().health_check()

        return SecurityStatusSchema(
            externalApiCount=egress_tracker.external_calls,
            cloudLlmCalls=egress_tracker.cloud_llm_calls,
            externalConnections=egress_tracker.external_calls,
            dataLeavingMachine=egress_tracker.external_calls,
            airGapStatus="ACTIVE" if egress_tracker.external_calls == 0 else "BREACHED",
            sandboxIsolation="SANDBOXED" if DOCKER_AVAILABLE else "UNAVAILABLE",
            networkStatus="LOCAL ONLY" if ollama_reachable else "OLLAMA UNREACHABLE",
            knowledgeBaseStatus="LOCAL (QDRANT)" if qdrant_service.is_available else "UNAVAILABLE"
        )


security_monitor = SecurityMonitorService()
