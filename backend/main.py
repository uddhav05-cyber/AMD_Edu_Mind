from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
from . import ai_models

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

class ChatResponse(BaseModel):
    answer: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    answer = await ai_models.chat(req.question)
    return ChatResponse(answer=answer)


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
