import io
import pytest
from app.services.models.ollama_client import OllamaProvider

ollama_provider = OllamaProvider()




def test_root_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_api_v1_health(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "services" in data


def test_auth_register_and_login(client):
    reg_payload = {
        "email": "test_operator@cybernex.local",
        "password": "sovereign_secure_password_123",
        "full_name": "Test Operator"
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "test_operator@cybernex.local"

    login_payload = {
        "email": "test_operator@cybernex.local",
        "password": "sovereign_secure_password_123"
    }
    res_login = client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()


def test_models_list(client):
    res = client.get("/api/v1/models")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_file_upload_and_metadata(client):
    file_content = b"Unit test document content for sovereign testing fixture."
    file_tuple = ("fixture_doc.pdf", io.BytesIO(file_content), "application/pdf")
    res = client.post("/api/v1/files/upload", files={"file": file_tuple})
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "fixture_doc.pdf"
    assert data["type"] == "PDF"
    file_id = data["id"]

    # Retrieve metadata
    meta_res = client.get(f"/api/v1/files/{file_id}")
    assert meta_res.status_code == 200
    assert meta_res.json()["name"] == "fixture_doc.pdf"


def test_task_and_run_creation(client):
    task_payload = {
        "prompt": "Summarize fixture report and generate deliverable.",
        "model": "Auto",
        "tools": ["OCR", "Knowledge"],
        "file_ids": []
    }
    res = client.post("/api/v1/tasks", json=task_payload)
    assert res.status_code == 200
    data = res.json()
    assert "task_id" in data
    assert "run_id" in data
    run_id = data["run_id"]

    # Verify run details endpoint
    run_res = client.get(f"/api/v1/runs/{run_id}")
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["id"] == run_id
    assert run_data["status"] == "completed"
    assert len(run_data["steps"]) >= 5


def test_security_and_system_status(client):
    sec_res = client.get("/api/v1/security/status")
    assert sec_res.status_code == 200
    assert "airGapStatus" in sec_res.json()

    sys_res = client.get("/api/v1/system/status")
    assert sys_res.status_code == 200
    assert "cpuUsage" in sys_res.json()
    assert "memoryUsage" in sys_res.json()
    assert "gpuUsage" in sys_res.json()


@pytest.mark.asyncio
async def test_ollama_unavailable_state():
    bad_provider = ollama_provider.__class__(base_url="http://127.0.0.1:99999")
    is_online = await bad_provider.health_check()
    assert is_online is False
    gen_text = await bad_provider.generate("Test prompt", "llama3")
    assert "OLLAMA_UNAVAILABLE" in gen_text


def test_sandbox_docker_status(client):
    code_payload = {
        "code": "print('Test Sandbox')",
        "language": "python"
    }
    res = client.post("/api/v1/sandbox/run", json=code_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["SUCCESS", "SANDBOX_UNAVAILABLE"]
