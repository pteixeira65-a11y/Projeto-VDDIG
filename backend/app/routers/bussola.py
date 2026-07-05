"""Bússola do Saber: glossário curado de termos técnicos em linguagem simples."""
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..auth import get_current_user
from ..database import get_session
from ..models import Termo
from ..schemas import TermoOut

router = APIRouter(prefix="/api/bussola", tags=["bussola"])


@router.get("/termos", response_model=list[TermoOut])
def listar_termos(session: Session = Depends(get_session), _=Depends(get_current_user)):
    """Retorna o glossário completo; a busca/filtragem é feita no cliente."""
    return session.exec(select(Termo).order_by(Termo.termo)).all()
