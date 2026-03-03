"""Stub module for AI/ML functionality.

This file will eventually load and manage the various models, vector stores,
whisper, IndicNLP utilities, and external API wrappers mentioned in the
project requirements. For now the functions are placeholders so the server
can start.
"""
import asyncio
from . import nlp_utils

# global state placeholders
_loaded = False


def initialize_models():
    """Called on startup; load models or prepare vector stores."""
    global _loaded
    # TODO: load quantized Mistral/LLaMA via ONNX, initialize LangChain,
    # LlamaIndex, FAISS/ChromaDB, etc.  For now we just mark that the
    # initialization logic ran.
    _loaded = True
    print("[ai_models] initialization complete (stub)")


async def chat(prompt: str) -> str:
    """Return a canned response. Replace with actual model inference later."""
    # simulate async work
    await asyncio.sleep(0.1)
    return f"[stub bot] You said: {prompt}"


def embed(text: str) -> list[float]:
    """Placeholder that should call a real embedding model."""
    return [0.0]


def transcribe_audio(audio_bytes: bytes) -> str:
    """Placeholder for Whisper-based transcription."""
    return "(transcription would appear here)"

# Add more convenience functions as the backend grows (Bhashini API calls,
# IndicNLP processing, Supabase sync, etc.)
