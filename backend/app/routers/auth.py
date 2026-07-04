"""Rotas de autenticação."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import criar_token, get_current_user, verificar_senha
from ..database import get_session
from ..models import User
from ..schemas import LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(dados: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == dados.email)).first()
    if not user or not verificar_senha(dados.senha, user.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    token = criar_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
