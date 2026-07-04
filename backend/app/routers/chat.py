"""Rota do assistente (chatbot) do Espaço Setorial."""
from fastapi import APIRouter, Depends

from ..ai.agent import responder
from ..auth import get_current_user
from ..models import User
from ..schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, _: User = Depends(get_current_user)):
    return ChatResponse(resposta=responder(req.mensagem, req.contexto or ""))
