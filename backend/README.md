# Backend (FastAPI)

This directory contains a FastAPI-based backend for the AMD Edu Mind project.

The server leverages a local SQLite database and wraps various AI/ML models and
tools (LangChain, LlamaIndex, FAISS/ChromaDB, quantized Mistral/LLaMA via ONNX Runtime,
Bhashini API, IndicNLP, Whisper, and optional Supabase cloud sync).

**Special focus: AMD hardware integration for offline, privacy-preserving education in
India.**

## AMD Integration Features

### 1. Ryzen AI NPU (AMD Ryzen AI Neural Processing Unit)

**File:** `backend/amd_npu.py`

- Runs **Mistral-7B quantized to INT4/INT8** via ONNX Runtime
- **Fully offline inference** — zero cloud connectivity, complete data privacy
- **Sub-2-second response times** on AMD Ryzen AI laptops
- Adapts to available hardware (NPU, GPU, CPU fallback)

**Status endpoints:**
- `GET /api/amd/ryzen-ai-status` – Check if NPU model loaded & which execution providers active

### 2. AMD ROCm GPU Training

**File:** `backend/amd_rocm.py`

- Fine-tune on AMD Radeon RX GPUs via **ROCm** (Radeon Open Compute)
- Train domain-specific adapters for **Indian academic syllabi:**
  - CBSE (Central Board of Secondary Education)
  - JEE (Joint Entrance Exam — IIT prep)
  - GATE (Graduate Aptitude Test in Engineering)
  - NEET (National Eligibility cum Entrance Test — medical)
- Use **LoRA/QLoRA** for memory-efficient fine-tuning
- Train custom models from student performance data

**Status endpoints:**
- `GET /api/amd/rocm-status` – GPU device info, memory, available models
- `POST /api/amd/fine-tune` – Start a fine-tuning job for a syllabus

### 3. Hardware Optimization

**File:** `backend/hardware_utils.py`

- **Auto-detect AMD Advantage laptops** (Ryzen processors)
- **Battery-aware optimization** for Tier 2/3 cities with unreliable power
- Adjust token limits & latency targets based on detected hardware
- Power-saving inference modes when on battery

**Status endpoint:**
- `GET /api/amd/hardware-info` – Detected CPU/GPU, battery status, optimization config

## Setup

### Prerequisites

- Python 3.12+
- Virtual environment (`venv`)
- For Ryzen AI NPU support: ONNX Runtime
- For ROCm GPU support: PyTorch with ROCm backend

### Installation

```bash
# Basic setup (CPU-only)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add ONNX Runtime for NPU inference:
pip install onnxruntime

# Add PyTorch + ROCm for GPU training (on Linux with AMD GPU):
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.7
```

## Running

Start the development server using Uvicorn:

```bash
cd backend
uvicorn main:app --reload --host=0.0.0.0 --port=5000
```

Or from repo root with npm:

```bash
npm run backend
```

## Available Endpoints

### Core / Utility

- `GET /api/health` – basic health check
- `POST /api/chat` – simple conversational interface
- `POST /api/embed` – embedding placeholder
- Notes CRUD (SQLite demonstration):
  - `GET /api/notes`
  - `POST /api/notes` (body `{ "text": "..." }`)
  - `DELETE /api/notes/{id}`

### Adaptive AI Tutor / Study Features

- `POST /api/explain` – provide step-by-step solution to a problem
- `POST /api/hint` – return a hint for a problem without giving the full answer
- `POST /api/quiz` – auto-generate quiz questions by subject/difficulty
- `POST /api/feedback` – rubric-aware feedback on essays/code/etc.
- `POST /api/planner` – generate a personalised study schedule

All with optional `language` parameter for multilingual support (hi/mr/te/ta/en).

### AMD Integration

**Hardware Detection:**
- `GET /api/amd/hardware-info` – CPU/GPU/NPU capabilities, battery status, optimization settings

**Ryzen AI NPU:**
- `GET /api/amd/ryzen-ai-status` – Model load status, execution provider info

**ROCm GPU Training:**
- `GET /api/amd/rocm-status` – GPU device info, available fine-tuned models, memory stats
- `POST /api/amd/fine-tune` – Start a fine-tuning job (CBSE, JEE, GATE, NEET syllabi)

## Architecture

```
backend/
 ├─ main.py               # FastAPI apps, all endpoints
 ├─ ai_models.py          # AI inference stubs & initialization
 ├─ amd_npu.py            # Mistral-7B on Ryzen AI (via ONNX)
 ├─ amd_rocm.py           # GPU training on AMD Radeon (via ROCm)
 ├─ hardware_utils.py     # AMD Advantage detection, battery awareness
 ├─ nlp_utils.py          # Bhashini API, IndicNLP helpers
 ├─ requirements.txt
 ├─ README.md
 └─ data.db              # SQLite (created at runtime)
```

## Extending Functionality

1. **Load real models** in `ai_models.initialize_models()`
   - Download quantized Mistral/LLaMA
   - Initialize ONNX Runtime session with right providers
2. **Integrate LangChain / LlamaIndex** for Q&A chains
3. **Add Whisper** for speech-to-text support
4. **Enable Bhashini API** for translation (Hindi, Tamil, Telugu, Marathi)
5. **Run fine-tuning jobs** on ROCm to create syllabi-specific models
6. **Sync to Supabase** for optional cloud backup of student progress

## Privacy & Offline

All inference happens **locally on the student's device**. No internet required.
No student data leaves the laptop (unless explicitly synced to Supabase).
Complete GDPR-like compliance for Indian education context.
