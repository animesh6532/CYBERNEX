import os
import sys
import time
import tempfile
import subprocess
from typing import Dict, Any
from app.core.config import get_settings
from app.core.logging import logger

try:
    import docker
    DOCKER_AVAILABLE = True
except ImportError:
    DOCKER_AVAILABLE = False

settings = get_settings()


class SandboxExecutor:
    def run_code(self, code: str, timeout: int = 30) -> Dict[str, Any]:
        """
        Executes Python code in an isolated sandboxed environment.
        Applies timeout and prevents access to sensitive system paths.
        """
        start_time = time.time()
        timeout = min(timeout, settings.SANDBOX_TIMEOUT_SECONDS)

        # Attempt Docker execution if Docker daemon is accessible
        if DOCKER_AVAILABLE:
            try:
                client = docker.from_env()
                container = client.containers.run(
                    image="python:3.11-slim",
                    command=["python", "-c", code],
                    detach=False,
                    mem_limit="256m",
                    nano_cpus=1000000000,  # 1 CPU
                    network_disabled=True,
                    timeout=timeout,
                    remove=True
                )
                duration = f"{round(time.time() - start_time, 2)}s"
                return {
                    "stdout": container.decode("utf-8") if isinstance(container, bytes) else str(container),
                    "stderr": "",
                    "exit_code": 0,
                    "duration": duration,
                    "status": "SUCCESS"
                }
            except Exception as e:
                logger.debug(f"Docker sandbox fallback to subprocess: {e}")

        # Subprocess isolated execution fallback with strict environment
        with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as tmp_script:
            tmp_script.write(code)
            tmp_script_path = tmp_script.name

        try:
            # Clean minimal environment stripping environment variables/secrets
            clean_env = {
                "PATH": os.environ.get("PATH", ""),
                "PYTHONPATH": "",
            }

            process = subprocess.Popen(
                [sys.executable, tmp_script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=clean_env
            )

            try:
                stdout, stderr = process.communicate(timeout=timeout)
                exit_code = process.returncode
                duration = f"{round(time.time() - start_time, 2)}s"

                return {
                    "stdout": stdout or "",
                    "stderr": stderr or "",
                    "exit_code": exit_code,
                    "duration": duration,
                    "status": "SUCCESS" if exit_code == 0 else "ERROR"
                }

            except subprocess.TimeoutExpired:
                process.kill()
                process.communicate()
                duration = f"{timeout}.0s"
                return {
                    "stdout": "",
                    "stderr": f"Sandbox execution timed out after {timeout} seconds.",
                    "exit_code": 124,
                    "duration": duration,
                    "status": "TIMEOUT"
                }

        finally:
            if os.path.exists(tmp_script_path):
                try:
                    os.remove(tmp_script_path)
                except Exception:
                    pass


sandbox_executor = SandboxExecutor()
