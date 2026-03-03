"""
AMD ROCm Integration

GPU-accelerated training & fine-tuning on AMD Radeon RX GPUs for:
- Indian academic syllabi (CBSE, JEE, GATE, NEET, etc.)
- Custom domain-specific tutor models
- Student performance-based adaptive model personalization
"""

import os
from typing import Optional, List, Dict
from pathlib import Path

try:
    import torch
    if torch.cuda.is_available():
        # Check if running on AMD
        device = torch.device("cuda")
        print(f"[ROCm] GPU available: {torch.cuda.get_device_name(0) if device else 'None'}")
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    torch = None


class AMDROCm:
    """Wrapper for AMD GPU training via ROCm (torch.cuda on AMD)."""

    def __init__(self, device: str = "auto"):
        """
        Initialize AMD GPU training environment.

        Args:
            device: "cuda" (AMD GPU), "cpu", or "auto" (auto-detect)
        """
        self.device_type = device
        self.device = None
        self.initialized = False

        if HAS_TORCH:
            self._initialize_device()
        else:
            print(
                "[AMDROCm] PyTorch not installed. "
                "Install: pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.7"
            )

    def _initialize_device(self):
        """Detect and initialize AMD GPU device."""
        if self.device_type == "auto":
            if torch.cuda.is_available():
                self.device = torch.device("cuda")
                self.device_type = "cuda"
                self.initialized = True
                print(f"[ROCm] Using GPU: {torch.cuda.get_device_name(0)}")
            else:
                self.device = torch.device("cpu")
                self.device_type = "cpu"
                self.initialized = True
                print("[ROCm] GPU not available; using CPU")
        elif self.device_type == "cuda":
            if not torch.cuda.is_available():
                print("[ROCm] CUDA not available; falling back to CPU")
                self.device = torch.device("cpu")
                self.device_type = "cpu"
            else:
                self.device = torch.device("cuda")
                self.initialized = True
                print(f"[ROCm] Using AMD GPU: {torch.cuda.get_device_name(0)}")
        else:
            self.device = torch.device("cpu")
            self.initialized = True
            print("[ROCm] Using CPU")

    def start_fine_tuning_job(
        self,
        model_name: str,
        syllabus: str,
        training_data_path: str,
        output_path: str = "/models/fine_tuned",
        epochs: int = 3,
    ) -> Dict[str, str]:
        """
        Start a fine-tuning job for a student/syllabus combo.

        Args:
            model_name: Base model (e.g., "mistral-7b")
            syllabus: Target syllabus (e.g., "CBSE-Class-12-Math")
            training_data_path: Path to training dataset (JSON)
            output_path: Where to save fine-tuned model
            epochs: Number of training epochs

        Returns:
            Job info dict with job_id, status, etc.
        """
        if not self.initialized or not HAS_TORCH:
            return {
                "status": "failed",
                "error": "AMD GPU training not available; requires PyTorch + ROCm",
            }

        job_id = f"finetune_{model_name}_{syllabus.replace('-', '_')}"

        try:
            # Stub implementation: real code would load model, prepare data, run training loop
            print(f"[ROCm] Starting fine-tuning job: {job_id}")
            print(f"[ROCm] Model: {model_name} on {self.device}")
            print(f"[ROCm] Syllabus: {syllabus}")
            print(f"[ROCm] Data: {training_data_path}")

            # In production:
            # 1. Load base model (LLaMA, Mistral, etc.)
            # 2. Load training data (Q&A pairs from syllabus)
            # 3. Set up LoRA or QLoRA adapters for memory efficiency
            # 4. Train with mixed precision (fp16) on ROCm
            # 5. Save weights

            return {
                "status": "queued",
                "job_id": job_id,
                "model": model_name,
                "syllabus": syllabus,
                "device": str(self.device),
                "epochs": epochs,
                "output_path": output_path,
            }

        except Exception as e:
            return {
                "status": "failed",
                "job_id": job_id,
                "error": str(e),
            }

    def list_fine_tuned_models(self, syllabus: Optional[str] = None) -> List[str]:
        """
        List available fine-tuned models (for CBSE, JEE, GATE, etc.).

        Args:
            syllabus: Filter by syllabus (e.g., "CBSE")

        Returns:
            List of model identifiers
        """
        # Stub: would list from /models/fine_tuned
        models = [
            "mistral-7b-cbse-math",
            "mistral-7b-jee-physics",
            "mistral-7b-gate-cs",
            "llama2-7b-neet-biology",
        ]
        if syllabus:
            models = [m for m in models if syllabus.lower() in m.lower()]
        return models

    def get_gpu_memory_info(self) -> Dict[str, float]:
        """Return GPU memory stats (GB)."""
        if not self.initialized or not HAS_TORCH or not torch.cuda.is_available():
            return {"available": 0.0, "used": 0.0, "total": 0.0}

        try:
            total = torch.cuda.get_device_properties(0).total_memory / 1e9
            reserved = torch.cuda.memory_reserved(0) / 1e9
            used = torch.cuda.memory_allocated(0) / 1e9
            available = total - used

            return {
                "total_gb": round(total, 2),
                "used_gb": round(used, 2),
                "reserved_gb": round(reserved, 2),
                "available_gb": round(available, 2),
            }
        except Exception:
            return {"available": 0.0, "used": 0.0, "total": 0.0}

    def get_device_info(self) -> Dict[str, str]:
        """Return device info."""
        if not self.initialized:
            return {"device": "uninitialized"}

        info = {
            "device_type": self.device_type,
            "device_str": str(self.device),
        }

        if self.device_type == "cuda" and HAS_TORCH:
            try:
                info["gpu_name"] = torch.cuda.get_device_name(0)
                info["cuda_version"] = torch.version.cuda
                info["pytorch_version"] = torch.__version__
            except Exception:
                pass

        return info


# Global singleton
_rocm = None


def get_rocm_instance(device: str = "auto") -> AMDROCm:
    """Get or create AMDROCm singleton."""
    global _rocm
    if _rocm is None:
        _rocm = AMDROCm(device=device)
    return _rocm
