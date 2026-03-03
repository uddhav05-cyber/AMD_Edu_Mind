# Backend (Flask)

This directory contains a FastAPI-based backend for the AMD Edu Mind project.

The server is designed to leverage a local SQLite database and to eventually
wrap various AI/ML models and tools (LangChain, LlamaIndex, FAISS/ChromaDB,
quantized Mistral/LLaMA via ONNX Runtime, Bhashini API, IndicNLP, Whisper,
and optional Supabase cloud sync).

## Setup

1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running

Start the development server using Uvicorn:

```bash
cd backend
uvicorn main:app --reload --host=0.0.0.0 --port=5000
```

(or run `npm run backend` from the project root once npm is installed)

## Available endpoints

### Core / utility

- `GET /api/health` – basic health check
- `POST /api/chat` – simple conversational interface
- `POST /api/embed` – embedding placeholder
- Notes CRUD (SQLite demonstration):
  - `GET /api/notes`
  - `POST /api/notes` (body `{ "text": "..." }`)
  - `DELETE /api/notes/{id}`

### Adaptive AI tutor / study features

- `POST /api/explain` – provide step-by-step solution to a problem
- `POST /api/hint` – return a hint for a problem without giving the full
  answer
- `POST /api/quiz` – auto‑generate quiz questions by subject/difficulty
- `POST /api/feedback` – rubric‑aware feedback on essays/code/etc.
- `POST /api/planner` – generate a personalised study schedule from exam
  date, syllabus and performance gaps

All AI‑related endpoints accept an optional `language` parameter for
multilingual support (hi/mr/te/ta/en) and are currently stubs returning
placeholder data.  Implementations should call the models loaded in
`ai_models.py` and, where necessary, invoke Bhashini/IndicNLP for
translation/preprocessing.

The server allows cross‑origin requests so the React frontend can call it from
`localhost:5173`.

## Extending functionality

Add real model loading and inference in `ai_models.py`. Integrate Whisper for
speech–to–text and IndicNLP or Bhashini calls as needed. The SQLite database
file (`data.db`) lives next to `main.py` and can be synced to Supabase if a
cloud backend is required.
