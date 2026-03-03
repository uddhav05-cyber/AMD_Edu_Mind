from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import sqlite3
import os
try:
    from . import ai_models
    from . import hardware_utils
    from . import amd_npu
    from . import amd_rocm
except ImportError:
    import ai_models
    import hardware_utils
    import amd_npu
    import amd_rocm

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


# --- AMD Integration endpoints ---

class HardwareInfoResponse(BaseModel):
    system_info: Dict[str, str]
    is_amd_advantage: bool
    has_npu: bool
    has_amd_gpu: bool
    battery_saving_enabled: bool
    optimization_config: Dict[str, Any]


@app.get("/api/amd/hardware-info", response_model=HardwareInfoResponse)
async def get_hardware_info():
    """Return detected AMD hardware capabilities and optimization settings."""
    return HardwareInfoResponse(
        system_info=hardware_utils.HardwareOptimizer.get_system_info(),
        is_amd_advantage=hardware_utils.HardwareOptimizer.is_amd_advantage(),
        has_npu=hardware_utils.HardwareOptimizer.has_npu(),
        has_amd_gpu=hardware_utils.HardwareOptimizer.has_amd_gpu(),
        battery_saving_enabled=hardware_utils.HardwareOptimizer.should_enable_power_saving(),
        optimization_config=hardware_utils.get_optimization_config(),
    )


class RyzenAIStatusResponse(BaseModel):
    loaded: bool
    quantization: str
    npu_available: bool
    execution_providers: List[str]


@app.get("/api/amd/ryzen-ai-status", response_model=RyzenAIStatusResponse)
async def get_ryzen_ai_status():
    """Return status of Mistral-7B quantized model running on Ryzen AI NPU."""
    ryzen_ai = amd_npu.get_ryzen_ai_instance()
    hw_info = ryzen_ai.get_hardware_info()
    return RyzenAIStatusResponse(
        loaded=hw_info["model_loaded"],
        quantization=hw_info["quantization"],
        npu_available=hw_info["npu_available"],
        execution_providers=hw_info["execution_providers"],
    )


class ROCmStatusResponse(BaseModel):
    initialized: bool
    device_type: str
    device_info: Dict[str, str]
    available_fine_tuned_models: List[str]
    gpu_memory: Dict[str, float]


@app.get("/api/amd/rocm-status", response_model=ROCmStatusResponse)
async def get_rocm_status():
    """Return AMD ROCm GPU training capabilities."""
    rocm = amd_rocm.get_rocm_instance()
    return ROCmStatusResponse(
        initialized=rocm.initialized,
        device_type=rocm.device_type,
        device_info=rocm.get_device_info(),
        available_fine_tuned_models=rocm.list_fine_tuned_models(),
        gpu_memory=rocm.get_gpu_memory_info(),
    )


class FineTuneRequest(BaseModel):
    model_name: str  # e.g. "mistral-7b"
    syllabus: str  # e.g. "CBSE-Class-12-Math", "JEE-Advanced", "GATE-CSE"
    training_data_path: str
    epochs: int = 3


class FineTuneResponse(BaseModel):
    status: str
    job_id: str
    model: str
    syllabus: str
    error: str | None = None


@app.post("/api/amd/fine-tune", response_model=FineTuneResponse)
async def start_fine_tune(req: FineTuneRequest):
    """
    Start a fine-tuning job for a custom syllabus on AMD GPUs.

    This would train a domain-specific adapter (LoRA/QLoRA) for Indian curricula.
    """
    rocm = amd_rocm.get_rocm_instance()
    result = rocm.start_fine_tuning_job(
        model_name=req.model_name,
        syllabus=req.syllabus,
        training_data_path=req.training_data_path,
        epochs=req.epochs,
    )
    return FineTuneResponse(
        status=result["status"],
        job_id=result.get("job_id", ""),
        model=result.get("model", ""),
        syllabus=result.get("syllabus", req.syllabus),
        error=result.get("error", None),
    )


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
