"""Rotas do Dashboard Estratégico (Visão Estratégica — acesso restrito)."""
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from ..ai.agent import gerar_resumo_gestor
from ..auth import require_estrategico
from ..database import get_session
from ..models import Demanda, Meta, RecursoLOAS, Setor
from ..schemas import (
    DemandaTimelineItem,
    KpisOut,
    MetaRiscoItem,
    MetasPorSetorItem,
    RecursoItem,
)

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(require_estrategico)],
)

# Data de referência do sistema (coerente com o seed).
HOJE = date(2026, 7, 4)


def _em_risco(m: Meta) -> bool:
    """Meta atrasada, ou não concluída com prazo já vencido."""
    return m.status == "atrasada" or (m.status != "concluida" and m.prazo < HOJE)


def _setores_filtrados(session: Session, setor_id: Optional[int]) -> list[Setor]:
    query = select(Setor)
    if setor_id is not None:
        query = query.where(Setor.id == setor_id)
    return list(session.exec(query).all())


@router.get("/kpis", response_model=KpisOut)
def kpis(setor_id: Optional[int] = Query(None), session: Session = Depends(get_session)):
    metas_q = select(Meta)
    demandas_q = select(Demanda)
    recursos_q = select(RecursoLOAS)
    if setor_id is not None:
        metas_q = metas_q.where(Meta.setor_id == setor_id)
        demandas_q = demandas_q.where(Demanda.setor_id == setor_id)
        recursos_q = recursos_q.where(RecursoLOAS.setor_id == setor_id)

    metas = list(session.exec(metas_q).all())
    demandas = list(session.exec(demandas_q).all())
    recursos = list(session.exec(recursos_q).all())

    total_metas = len(metas)
    metas_concluidas = sum(1 for m in metas if m.status == "concluida")
    previsto = sum(r.valor_previsto for r in recursos)
    aplicado = sum(r.valor_aplicado for r in recursos)

    payload = {
        "total_metas": total_metas,
        "metas_concluidas": metas_concluidas,
        "pct_metas_concluidas": round(metas_concluidas / total_metas * 100, 1) if total_metas else 0.0,
        "demandas_abertas": sum(1 for d in demandas if d.status != "concluida"),
        "demandas_concluidas": sum(1 for d in demandas if d.status == "concluida"),
        "valor_previsto": previsto,
        "valor_aplicado": aplicado,
        "pct_recursos_aplicados": round(aplicado / previsto * 100, 1) if previsto else 0.0,
        "metas_em_risco": sum(1 for m in metas if _em_risco(m)),
    }
    payload["resumo_gestor"] = gerar_resumo_gestor(payload)
    return payload


@router.get("/metas-por-setor", response_model=list[MetasPorSetorItem])
def metas_por_setor(setor_id: Optional[int] = Query(None), session: Session = Depends(get_session)):
    out = []
    for setor in _setores_filtrados(session, setor_id):
        metas = session.exec(select(Meta).where(Meta.setor_id == setor.id)).all()
        counts = {"nao_iniciada": 0, "em_andamento": 0, "concluida": 0, "atrasada": 0}
        for m in metas:
            if m.status in counts:
                counts[m.status] += 1
        out.append(MetasPorSetorItem(setor=setor.nome, **counts))
    return out


@router.get("/recursos", response_model=list[RecursoItem])
def recursos(setor_id: Optional[int] = Query(None), session: Session = Depends(get_session)):
    out = []
    for setor in _setores_filtrados(session, setor_id):
        rs = session.exec(select(RecursoLOAS).where(RecursoLOAS.setor_id == setor.id)).all()
        out.append(RecursoItem(
            setor=setor.nome,
            previsto=sum(r.valor_previsto for r in rs),
            aplicado=sum(r.valor_aplicado for r in rs),
        ))
    return out


@router.get("/demandas-timeline", response_model=list[DemandaTimelineItem])
def demandas_timeline(setor_id: Optional[int] = Query(None), session: Session = Depends(get_session)):
    query = select(Demanda)
    if setor_id is not None:
        query = query.where(Demanda.setor_id == setor_id)
    demandas = session.exec(query).all()

    buckets: dict[str, int] = {}
    for d in demandas:
        if d.status == "concluida" and d.concluida_em:
            chave = d.concluida_em.strftime("%Y-%m")
            buckets[chave] = buckets.get(chave, 0) + 1
    return [DemandaTimelineItem(periodo=k, concluidas=buckets[k]) for k in sorted(buckets)]


@router.get("/metas-em-risco", response_model=list[MetaRiscoItem])
def metas_em_risco(setor_id: Optional[int] = Query(None), session: Session = Depends(get_session)):
    query = select(Meta)
    if setor_id is not None:
        query = query.where(Meta.setor_id == setor_id)
    metas = [m for m in session.exec(query).all() if _em_risco(m)]
    metas.sort(key=lambda m: m.prazo)

    nomes = {s.id: s.nome for s in session.exec(select(Setor)).all()}
    return [
        MetaRiscoItem(
            titulo=m.titulo,
            setor=nomes.get(m.setor_id, "—"),
            status=m.status,
            progresso=m.progresso,
            prazo=m.prazo.isoformat(),
        )
        for m in metas
    ]
