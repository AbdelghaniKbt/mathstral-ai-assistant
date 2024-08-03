from pydantic import BaseModel
from typing import Optional


class GenerateRequest(BaseModel):
    text: str
    max_new_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 1.0
    top_k: int = 50


class InitializeRequest(BaseModel):
    hf_token: str
    serving_framework: str = "llama"


class Response(BaseModel):
    message: str


class StreamResponse(BaseModel):
    token: str
    finished: bool
    error: Optional[str] = None
