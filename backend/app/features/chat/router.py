from fastapi import APIRouter, status
from app.features.chat.schemas import ChatRequest, ChatResponse
from app.features.chat.service import generate_advisor_reply
from app.core.config import settings

router = APIRouter(prefix="/chat", tags=["AI Advisor"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_advisor(payload: ChatRequest):
    reply = await generate_advisor_reply(
        messages=payload.messages,
        profile_context=payload.profile_context,
    )
    return ChatResponse(
        reply=reply,
        model=settings.GEMINI_MODEL or "gemini-3-flash-preview"
    )
