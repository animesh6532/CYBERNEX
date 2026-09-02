import logging
import sys
import re
from app.core.config import get_settings

settings = get_settings()

SENSITIVE_PATTERNS = [
    re.compile(r'("?password"?\s*:\s*)"[^"]+"', re.IGNORECASE),
    re.compile(r'("?secret"?\s*:\s*)"[^"]+"', re.IGNORECASE),
    re.compile(r'("?token"?\s*:\s*)"[^"]+"', re.IGNORECASE),
    re.compile(r'("?jwt"?\s*:\s*)"[^"]+"', re.IGNORECASE),
]


class SanitizingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        formatted = super().format(record)
        for pattern in SENSITIVE_PATTERNS:
            formatted = pattern.sub(r'\1"[REDACTED]"', formatted)
        return formatted


def setup_logging():
    logger = logging.getLogger("cybernex")
    logger.setLevel(logging.INFO if not settings.DEBUG else logging.DEBUG)

    handler = logging.StreamHandler(sys.stdout)
    formatter = SanitizingFormatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(handler)

    return logger


logger = setup_logging()
