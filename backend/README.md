# CYBERNEX — Sovereign Local FastAPI Backend

Clean, modular FastAPI backend for **CYBERNEX**: Sovereign On-Premise Agentic AI Workbench using Open-Weight Multimodal LLMs for Confidential Industrial Work.

## 🚀 Quick Start

### 1. Requirements
- Python 3.11+

### 2. Setup Virtual Environment
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
```

### 5. Launch FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```

- **OpenAPI Interactive Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`
- **Health Check Endpoint**: `http://127.0.0.1:8000/api/v1/health`

---

## 🏛️ Directory Architecture

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   └── v1/ (health, auth, workbench, tasks, files, models, knowledge, documents, runs, ocr, sandbox, security, system, settings)
│   ├── core/ (config, security, logging)
│   ├── db/ (database, models)
│   ├── schemas/ (Pydantic v2 schemas)
│   ├── services/ (agent, models/ollama, router, ocr, rag/qdrant, sandbox, documents, vision, security, system)
│   └── main.py
├── storage/ (uploads, documents, outputs, logs)
├── tests/
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🔒 Security & Local-First Guarantees

- **Zero External LLM Calls**: External connections disabled by default.
- **Isolated Sandbox**: Docker / subprocess resource-bounded python sandbox.
- **Air-Gap Telemetry**: Real-time monitoring of local network state.
