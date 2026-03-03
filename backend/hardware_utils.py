"""
Hardware Utilities

Detect AMD Advantage platform, optimize for battery life, manage offline operation.
"""

import platform
import subprocess
from typing import Dict, Optional
from pathlib import Path


class HardwareOptimizer:
    """Detect and optimize for AMD Advantage laptops + Ryzen AI."""

    @staticmethod
    def get_system_info() -> Dict[str, str]:
        """Return CPU/GPU/OS info."""
        return {
            "system": platform.system(),
            "processor": platform.processor(),
            "machine": platform.machine(),
            "python_version": platform.python_version(),
        }

    @staticmethod
    def is_amd_advantage() -> bool:
        """
        Detect if running on AMD Advantage laptop.

        Heuristics:
        - AMD Ryzen processor present
        - Potential Radeon GPU or NPU
        """
        try:
            cpu_info = platform.processor().lower()
            if "amd" in cpu_info or "ryzen" in cpu_info:
                return True

            # Windows: check via WMI
            if platform.system() == "Windows":
                try:
                    result = subprocess.run(
                        ["wmic", "cpu", "get", "name"],
                        capture_output=True,
                        timeout=2,
                        text=True,
                    )
                    return "Ryzen" in result.stdout or "EPYC" in result.stdout
                except Exception:
                    pass

            # Linux: check /proc/cpuinfo
            if platform.system() == "Linux":
                try:
                    with open("/proc/cpuinfo") as f:
                        cpuinfo = f.read().lower()
                        return "amd" in cpuinfo or "ryzen" in cpuinfo
                except Exception:
                    pass

        except Exception:
            pass

        return False

    @staticmethod
    def has_npu() -> bool:
        """Check for NPU (neural processing unit) availability."""
        # Ryzen AI NPU detection
        try:
            # Windows: check for Intel/AMD NPU
            if platform.system() == "Windows":
                result = subprocess.run(
                    ["powershell", "Get-PnpDevice | Where-Object {$_.Class -eq 'Processor'}"],
                    capture_output=True,
                    timeout=2,
                    text=True,
                )
                return (
                    "NPU" in result.stdout
                    or "Neural" in result.stdout
                    or "AI Accelerator" in result.stdout
                )
        except Exception:
            pass

        return False

    @staticmethod
    def has_amd_gpu() -> bool:
        """Check for AMD Radeon GPU."""
        try:
            # Linux: rocm-smi
            if platform.system() == "Linux":
                result = subprocess.run(
                    ["rocm-smi"],
                    capture_output=True,
                    timeout=2,
                )
                return result.returncode == 0

            # Windows: check via WMI or devicemanager
            if platform.system() == "Windows":
                result = subprocess.run(
                    ["wmic", "path", "win32_videocontroller", "get", "name"],
                    capture_output=True,
                    timeout=2,
                    text=True,
                )
                return "Radeon" in result.stdout or "AMD" in result.stdout

        except Exception:
            pass

        return False

    @staticmethod
    def get_battery_status() -> Dict[str, Optional[str]]:
        """
        Return battery info (for optimization on Tier 2/3 city laptops with unstable power).

        Returns:
            {
                "plugged_in": bool,
                "percent": int,
                "time_remaining": str (if on battery)
            }
        """
        try:
            if platform.system() == "Linux":
                # Linux: use /sys/class/power_supply
                battery_path = Path("/sys/class/power_supply/BAT0")
                if battery_path.exists():
                    with open(battery_path / "capacity") as f:
                        percent = int(f.read().strip())
                    with open(battery_path / "status") as f:
                        status = f.read().strip()
                    return {
                        "plugged_in": status == "Full" or status == "Charging",
                        "percent": percent,
                        "battery_available": True,
                    }

            if platform.system() == "Windows":
                # Windows: use WMI
                result = subprocess.run(
                    ["wmic", "path", "Win32_Battery", "get", "BatteryStatus,EstimatedChargeRemaining"],
                    capture_output=True,
                    timeout=2,
                    text=True,
                )
                if "BatteryStatus" in result.stdout:
                    lines = result.stdout.strip().split("\n")
                    if len(lines) > 1:
                        parts = lines[1].split()
                        if parts:
                            status = int(parts[0]) if len(parts) > 0 else 0
                            percent = int(parts[1]) if len(parts) > 1 else 0
                            return {
                                "plugged_in": status == 2,  # 2 = AC Power
                                "percent": percent,
                                "battery_available": True,
                            }

        except Exception:
            pass

        return {
            "plugged_in": None,
            "percent": None,
            "battery_available": False,
        }

    @staticmethod
    def should_enable_power_saving() -> bool:
        """Decide if power-saving optimizations should be enabled."""
        battery = HardwareOptimizer.get_battery_status()
        if battery.get("battery_available"):
            # Enable if on battery or low charge
            return not battery.get("plugged_in", False) or (battery.get("percent", 100) < 30)
        return False


def get_optimization_config() -> Dict:
    """
    Return hardware-aware optimization config.

    Adjusts inference parameters based on detected hardware.
    """
    is_advantage = HardwareOptimizer.is_amd_advantage()
    has_npu = HardwareOptimizer.has_npu()
    has_gpu = HardwareOptimizer.has_amd_gpu()
    battery_saving = HardwareOptimizer.should_enable_power_saving()

    # Default: assume offline, student laptop
    config = {
        "offline_mode": True,
        "max_response_tokens": 256,  # ~1000 chars
        "target_latency_ms": 2000,  # Sub-2-second goal
        "quantization": "int4",  # INT4 for NPU
        "hardware_target": "cpu",  # Fallback
    }

    if is_advantage:
        config["hardware_target"] = "amd_advantage"
        config["battery_aware"] = True

    if has_npu:
        config["hardware_target"] = "npu"
        config["quantization"] = "int4"
        config["max_response_tokens"] = 512
        config["target_latency_ms"] = 1500

    if has_gpu:
        config["hardware_target"] = "rocm_gpu"
        config["max_response_tokens"] = 1024
        config["target_latency_ms"] = 1000

    if battery_saving:
        config["target_latency_ms"] = min(config["target_latency_ms"], 3000)
        config["max_response_tokens"] = min(config["max_response_tokens"], 128)
        config["reduce_precision"] = True

    return config
