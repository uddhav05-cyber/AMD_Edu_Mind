"""Utility wrappers for external NLP resources.

- Bhashini API (Indian government translation/ASR/NER, etc.)
- IndicNLP library helpers
"""
import requests

BHASHINI_ENDPOINT = "https://api.bhashini.gov.in/"  # placeholder


def call_bhashini(path: str, payload: dict, api_key: str = None) -> dict:
    """Generic POST helper for the Bhashini API."""
    url = BHASHINI_ENDPOINT + path
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    resp = requests.post(url, json=payload, headers=headers)
    resp.raise_for_status()
    return resp.json()


def preprocess_indic(text: str) -> str:
    """Run any IndicNLP normalization/segmentation.  Stub for now."""
    # from indicnlp import common
    # from indicnlp import transliterate
    # ...
    return text
