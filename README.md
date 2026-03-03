# AMD_Edu_Mind

This repository contains a React/Tailwind frontend built with Vite and a Python/FastAPI backend (AI/ML stack with LangChain, LlamaIndex, ONNX Runtime, etc.).

## Frontend

The frontend lives in the root of the workspace and uses Vite.

```bash
# install dependencies (node.js + npm/yarn required)
npm install
npm run dev  # start development server on localhost:5173
```

## Backend

A FastAPI server lives inside the `backend` folder.  It is pre‑wired for a
local SQLite database and will eventually expose AI/ML services using the
libraries referenced in `requirements.txt`.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host=0.0.0.0 --port=5000
```

(or from the project root run `npm run backend` once Node is installed)

The frontend can call the backend at `http://localhost:5000` (CORS is enabled).

