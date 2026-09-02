import io

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
        "email": "operator@cybernex.local",
        "password": "sovereign_secure_password_123",
        "full_name": "Sovereign Operator"
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "operator@cybernex.local"

    # Test login
    login_payload = {
        "email": "operator@cybernex.local",
        "password": "sovereign_secure_password_123"
    }
    res_login = client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()


def test_models_list(client):
    res = client.get("/api/v1/models")
    assert res.status_code == 200
    models_data = res.json()
    assert len(models_data) >= 3
    categories = [m["category"] for m in models_data]
    assert "GENERAL" in categories
    assert "CODING" in categories
    assert "VISION" in categories


def test_task_creation(client):
    task_payload = {
        "prompt": "Analyze inspection telemetry and prepare approval note.",
        "model": "Auto",
        "tools": ["OCR", "Knowledge", "Documents"],
        "file_ids": []
    }
    res = client.post("/api/v1/tasks", json=task_payload)
    assert res.status_code == 200
    data = res.json()
    assert "task_id" in data
    assert "run_id" in data
    assert data["status"] == "created"


def test_file_upload(client):
    file_content = b"Turbine unit #4 inspection report content for sovereign testing."
    file_tuple = ("test_inspection.pdf", io.BytesIO(file_content), "application/pdf")
    res = client.post("/api/v1/files/upload", files={"file": file_tuple})
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "test_inspection.pdf"
    assert data["type"] == "PDF"


def test_sandbox_run(client):
    code_payload = {
        "code": "print('CYBERNEX Sandbox Isolation Test Passed')",
        "language": "python"
    }
    res = client.post("/api/v1/sandbox/run", json=code_payload)
    assert res.status_code == 200
    data = res.json()
    assert "CYBERNEX Sandbox Isolation Test Passed" in data["stdout"]
    assert data["exit_code"] == 0
    assert data["status"] == "SUCCESS"


def test_security_and_system_status(client):
    sec_res = client.get("/api/v1/security/status")
    assert sec_res.status_code == 200
    assert sec_res.json()["airGapStatus"] == "ACTIVE"

    sys_res = client.get("/api/v1/system/status")
    assert sys_res.status_code == 200
    assert "cpuUsage" in sys_res.json()
