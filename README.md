# 🧠 AMD EduMind

An AI-powered educational platform built with a **React + Vite** frontend and a **FastAPI + LangChain** backend. EduMind leverages modern AI/ML libraries to deliver intelligent learning experiences.

---

## 🚀 Tech Stack

### Frontend
| Tech | Role |
|---|---|
| React | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |

### Backend
| Tech | Role |
|---|---|
| FastAPI | REST API server |
| LangChain | LLM orchestration |
| LlamaIndex | Document indexing & retrieval |
| ONNX Runtime | Model inference |
| SQLite | Local database |

---

## 📁 Project Structure

```
AMD_Edu_Mind/
├── backend/             # FastAPI server (Python)
│   ├── main.py
│   └── requirements.txt
├── src/                 # React frontend source
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- npm

---

### Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (runs on http://localhost:5000)
uvicorn main:app --reload --host=0.0.0.0 --port=5000
```

> The frontend is pre-configured to call the backend at `http://localhost:5000`. CORS is enabled.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use and modify it.

---

> Built by [uddhav05-cyber](https://github.com/uddhav05-cyber)
