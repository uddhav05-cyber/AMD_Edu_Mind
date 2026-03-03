from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
import os
try:
    from . import ai_models
except ImportError:
    import ai_models

app = FastAPI(title="EduMind Backend")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    # initialize local SQLite database and AI models
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT)")
    db.commit()
    db.close()
    ai_models.initialize_models()

@app.get("/api/health")
async def health():
    return {"status": "ok"}

class ChatRequest(BaseModel):
    question: str
    language: str | None = None  # e.g. 'en','hi','mr','te','ta'

class ChatResponse(BaseModel):
    answer: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    answer = await ai_models.chat(req.question, language=req.language)
    return ChatResponse(answer=answer)


# --- advanced tutor endpoints ---

class ExplanationRequest(BaseModel):
    problem: str
    language: str | None = None
    student_level: str | None = None

class ExplanationResponse(BaseModel):
    steps: List[str]
    hints: List[str] = []

@app.post("/api/explain", response_model=ExplanationResponse)
async def explain(req: ExplanationRequest):
    result = await ai_models.explain_problem(req.problem, language=req.language, level=req.student_level)
    return ExplanationResponse(steps=result.get("steps", []), hints=result.get("hints", []))

class HintRequest(BaseModel):
    problem: str
    language: str | None = None

class HintResponse(BaseModel):
    hint: str

@app.post("/api/hint", response_model=HintResponse)
async def hint(req: HintRequest):
    h = await ai_models.generate_hint(req.problem, language=req.language)
    return HintResponse(hint=h)

class QuizRequest(BaseModel):
    subject: str
    count: int = 5
    difficulty: str | None = None
    language: str | None = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str] = []

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

@app.post("/api/quiz", response_model=QuizResponse)
async def make_quiz(req: QuizRequest):
    qs = await ai_models.generate_quiz(req.subject, req.count, req.difficulty, language=req.language)
    return QuizResponse(questions=qs)

class FeedbackRequest(BaseModel):
    submission: str
    rubric: str | None = None
    language: str | None = None

class FeedbackResponse(BaseModel):
    feedback: str

@app.post("/api/feedback", response_model=FeedbackResponse)
async def feedback(req: FeedbackRequest):
    fb = await ai_models.analyze_submission(req.submission, rubric=req.rubric, language=req.language)
    return FeedbackResponse(feedback=fb)

class PlannerRequest(BaseModel):
    exam_date: str
    subjects: List[str]
    performance_gaps: dict[str, float] = {}

class PlannerResponse(BaseModel):
    schedule: List[str]

@app.post("/api/planner", response_model=PlannerResponse)
async def planner(req: PlannerRequest):
    sched = await ai_models.plan_study(req.exam_date, req.subjects, req.performance_gaps)
    return PlannerResponse(schedule=sched)


class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    vector: List[float]

@app.post("/api/embed", response_model=EmbedResponse)
async def embed(req: EmbedRequest):
    vec = ai_models.embed(req.text)
    return EmbedResponse(vector=vec)

class Note(BaseModel):
    id: int
    text: str

class NewNote(BaseModel):
    text: str

@app.get("/api/notes", response_model=list[Note])
async def list_notes():
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("SELECT id, text FROM notes")
    notes = [Note(id=row[0], text=row[1]) for row in cursor.fetchall()]
    db.close()
    return notes

@app.post("/api/notes", response_model=Note)
async def create_note(note: NewNote):
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("INSERT INTO notes (text) VALUES (?)", (note.text,))
    db.commit()
    note_id = cursor.lastrowid
    db.close()
    return Note(id=note_id, text=note.text)

@app.delete("/api/notes/{note_id}", status_code=204)
async def delete_note(note_id: int):
    db = sqlite3.connect("data.db")
    cursor = db.cursor()
    cursor.execute("DELETE FROM notes WHERE id=?", (note_id,))
    db.commit()
    db.close()
    return
