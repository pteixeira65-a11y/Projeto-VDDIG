"""Rota de listagem de setores (para os filtros do dashboard)."""
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..auth import get_current_user
from ..database import get_session
from ..models import Setor
from ..schemas import SetorOut

router = APIRouter(prefix="/api", tags=["setores"])


@router.get("/setores", response_model=list[SetorOut])
def listar_setores(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(Setor)).all()
