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

- `GET /api/health` – basic health check
- `POST /api/chat` – accepts `{ "question": "..." }` and returns `{ "answer": "..." }`
- `POST /api/embed` – simple embedding stub, takes `{ "text": "..." }` and returns a `vector` array
- Notes CRUD for demonstration:
  - `GET /api/notes`
  - `POST /api/notes` (body `{ "text": "..." }`)
  - `DELETE /api/notes/{id}`

The server allows cross‑origin requests so the React frontend can call it from
`localhost:5173`.

## Extending functionality

Add real model loading and inference in `ai_models.py`. Integrate Whisper for
speech–to–text and IndicNLP or Bhashini calls as needed. The SQLite database
file (`data.db`) lives next to `main.py` and can be synced to Supabase if a
cloud backend is required.
