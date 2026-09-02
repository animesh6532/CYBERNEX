from fastapi import APIRouter, HTTPException
from app.schemas.security import SandboxRunRequest, SandboxRunResponse
from app.services.sandbox.executor import sandbox_executor

router = APIRouter(prefix="/sandbox", tags=["Python Sandbox"])


@router.post("/run", response_model=SandboxRunResponse, summary="Execute Python Script in Sandbox")
def run_sandbox(req: SandboxRunRequest):
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Code string cannot be empty.")

    res = sandbox_executor.run_code(code=req.code, timeout=req.timeout)
    return SandboxRunResponse(
        stdout=res["stdout"],
        stderr=res["stderr"],
        exit_code=res["exit_code"],
        duration=res["duration"],
        status=res["status"]
    )
