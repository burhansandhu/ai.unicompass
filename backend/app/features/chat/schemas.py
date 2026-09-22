from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessageSchema(BaseModel):
    role: str = Field(description="'user' or 'model' / 'advisor'")
    text: str = Field(description="Message content")


class ChatRequest(BaseModel):
    messages: List[ChatMessageSchema] = Field(
        ..., min_length=1, description="Chronological chat message history"
    )
    profile_context: Optional[Dict[str, Any]] = Field(
        default=None, description="Optional student profile details for personalization"
    )


class ChatResponse(BaseModel):
    reply: str
    model: str
