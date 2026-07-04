"""Rotas do Espaço Setorial: métricas do setor e cadastro de metas."""
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from ..ai.agent import gerar_resumo_gestor
from ..auth import get_current_user
from ..database import get_session
from ..dlp import analisar
from ..models import Demanda, Meta, RecursoLOAS, Setor, User
from ..schemas import (
    DlpFinding,
    MetaCreate,
    MetaCriadaOut,
    MetaOut,
    MetasPorSetorItem,
    SetorMetricasOut,
)

router = APIRouter(prefix="/api/setor", tags=["setor"])

HOJE = date(2026, 7, 4)
STATUS_VALIDOS = {"nao_iniciada", "em_andamento", "concluida", "atrasada"}


def _em_risco(m: Meta) -> bool:
    return m.status == "atrasada" or (m.status != "concluida" and m.prazo < HOJE)


def _resolver_setor(user: User, setor_id: Optional[int], session: Session) -> int:
    """Funcionário sempre opera no próprio setor; estratégico deve informar setor_id."""
    if user.role == "funcionario":
        if user.setor_id is None:
            raise HTTPException(status_code=400, detail="Usuário sem setor associado")
        return user.setor_id
    # Perfil estratégico
    if setor_id is None:
        raise HTTPException(status_code=400, detail="Informe o setor_id")
    if not session.get(Setor, setor_id):
        raise HTTPException(status_code=404, detail="Setor não encontrado")
    return setor_id


@router.get("/metricas", response_model=SetorMetricasOut)
def metricas(
    setor_id: Optional[int] = Query(None),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    sid = _resolver_setor(user, setor_id, session)
    setor = session.get(Setor, sid)
    metas = session.exec(select(Meta).where(Meta.setor_id == sid)).all()
    demandas = session.exec(select(Demanda).where(Demanda.setor_id == sid)).all()
    recursos = session.exec(select(RecursoLOAS).where(RecursoLOAS.setor_id == sid)).all()

    total = len(metas)
    concluidas = sum(1 for m in metas if m.status == "concluida")
    counts = {"nao_iniciada": 0, "em_andamento": 0, "concluida": 0, "atrasada": 0}
    for m in metas:
        if m.status in counts:
            counts[m.status] += 1
    previsto = sum(r.valor_previsto for r in recursos)
    aplicado = sum(r.valor_aplicado for r in recursos)

    payload = {
        "setor_id": sid,
        "setor": setor.nome,
        "total_metas": total,
        "metas_concluidas": concluidas,
        "pct_metas_concluidas": round(concluidas / total * 100, 1) if total else 0.0,
        "metas_em_risco": sum(1 for m in metas if _em_risco(m)),
        "demandas_abertas": sum(1 for d in demandas if d.status != "concluida"),
        "demandas_concluidas": sum(1 for d in demandas if d.status == "concluida"),
        "valor_previsto": previsto,
        "valor_aplicado": aplicado,
        "pct_recursos_aplicados": round(aplicado / previsto * 100, 1) if previsto else 0.0,
        "metas_por_status": [MetasPorSetorItem(setor=setor.nome, **counts)],
    }
    payload["resumo_gestor"] = gerar_resumo_gestor(payload)
    return payload


@router.get("/metas", response_model=list[MetaOut])
def listar_metas(
    setor_id: Optional[int] = Query(None),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    sid = _resolver_setor(user, setor_id, session)
    return session.exec(select(Meta).where(Meta.setor_id == sid).order_by(Meta.prazo)).all()


@router.post("/metas", response_model=MetaCriadaOut, status_code=201)
def criar_meta(
    dados: MetaCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    sid = _resolver_setor(user, dados.setor_id, session)
    titulo = dados.titulo.strip()
    if not titulo:
        raise HTTPException(status_code=422, detail="O título da meta é obrigatório")

    status = dados.status if dados.status in STATUS_VALIDOS else "nao_iniciada"
    progresso = max(0, min(100, dados.progresso))
    descricao = (dados.descricao or "").strip() or None

    meta = Meta(
        setor_id=sid,
        titulo=titulo,
        descricao=descricao,
        status=status,
        progresso=progresso,
        prazo=dados.prazo,
    )
    session.add(meta)
    session.commit()
    session.refresh(meta)

    # Alerta de conscientização (não bloqueia a gravação).
    achados = analisar(f"{titulo} {descricao or ''}")
    return {"meta": meta, "dlp": [DlpFinding(**a) for a in achados]}


@router.delete("/metas/{meta_id}", status_code=204)
def remover_meta(
    meta_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    meta = session.get(Meta, meta_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    if user.role == "funcionario" and meta.setor_id != user.setor_id:
        raise HTTPException(status_code=403, detail="Meta pertence a outro setor")
    session.delete(meta)
    session.commit()
