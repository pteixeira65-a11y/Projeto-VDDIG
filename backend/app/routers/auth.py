"""Rotas de autenticação."""
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import criar_token, get_current_user, hash_senha, verificar_senha
from ..database import get_session
from ..models import User
from ..schemas import (
    LoginRequest,
    RecuperarSenhaRequest,
    RecuperarSenhaResponse,
    RedefinirSenhaRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/api", tags=["auth"])

# Códigos de recuperação em memória (protótipo). Em produção: enviar por e-mail
# e persistir com expiração. email -> (codigo, expira_em).
_codigos_recuperacao: dict[str, tuple[str, datetime]] = {}
_CODIGO_VALIDADE_MIN = 15


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


@router.post("/senha/recuperar", response_model=RecuperarSenhaResponse)
def recuperar_senha(dados: RecuperarSenhaRequest, session: Session = Depends(get_session)):
    """Gera um código de recuperação. Em produção o código vai por e-mail;
    no protótipo (sem SMTP) ele é devolvido no campo `codigo_dev`."""
    user = session.exec(select(User).where(User.email == dados.email)).first()
    if not user:
        # Não revela se o e-mail existe (resposta genérica).
        return RecuperarSenhaResponse(ok=True, codigo_dev=None)
    codigo = f"{secrets.randbelow(1_000_000):06d}"
    expira = datetime.now(timezone.utc) + timedelta(minutes=_CODIGO_VALIDADE_MIN)
    _codigos_recuperacao[dados.email] = (codigo, expira)
    # TODO(produção): enviar `codigo` por e-mail (SMTP) e NÃO retornar aqui.
    return RecuperarSenhaResponse(ok=True, codigo_dev=codigo)


@router.post("/senha/redefinir")
def redefinir_senha(dados: RedefinirSenhaRequest, session: Session = Depends(get_session)):
    """Redefine a senha mediante o código de verificação válido."""
    registro = _codigos_recuperacao.get(dados.email)
    if not registro:
        raise HTTPException(status_code=400, detail="Solicite um novo código de recuperação.")
    codigo, expira = registro
    if datetime.now(timezone.utc) > expira:
        _codigos_recuperacao.pop(dados.email, None)
        raise HTTPException(status_code=400, detail="Código expirado. Solicite um novo.")
    if not secrets.compare_digest(dados.codigo, codigo):
        raise HTTPException(status_code=400, detail="Código inválido.")
    if len(dados.nova_senha) < 6:
        raise HTTPException(status_code=400, detail="A nova senha deve ter ao menos 6 caracteres.")
    user = session.exec(select(User).where(User.email == dados.email)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Usuário não encontrado.")
    user.senha_hash = hash_senha(dados.nova_senha)
    session.add(user)
    session.commit()
    _codigos_recuperacao.pop(dados.email, None)
    return {"ok": True}
