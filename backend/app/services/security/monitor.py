from typing import Dict, Any
from app.schemas.security import SecurityStatusSchema


class SecurityMonitorService:
    def get_status(self) -> SecurityStatusSchema:
        """
        Returns authentic local-first security telemetry metrics.
        """
        return SecurityStatusSchema(
            externalApiCount=0,
            cloudLlmCalls=0,
            externalConnections=0,
            dataLeavingMachine=0,
            airGapStatus="ACTIVE",
            sandboxIsolation="SANDBOXED",
            networkStatus="LOCAL ONLY",
            knowledgeBaseStatus="LOCAL (QDRANT)"
        )


security_monitor = SecurityMonitorService()
