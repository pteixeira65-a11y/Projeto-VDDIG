"""Schemas Pydantic de entrada/saída da API."""
from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    email: str
    senha: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    nome: str
    email: str
    role: str
    setor_id: Optional[int] = None


class SetorOut(BaseModel):
    id: int
    nome: str
    missao: str = ""
    objetivos: str = ""


class KpisOut(BaseModel):
    total_metas: int
    metas_concluidas: int
    pct_metas_concluidas: float
    demandas_abertas: int
    demandas_concluidas: int
    valor_previsto: float
    valor_aplicado: float
    pct_recursos_aplicados: float
    metas_em_risco: int
    resumo_gestor: str


class MetasPorSetorItem(BaseModel):
    setor: str
    nao_iniciada: int
    em_andamento: int
    concluida: int
    atrasada: int


class RecursoItem(BaseModel):
    setor: str
    previsto: float
    aplicado: float


class DemandaTimelineItem(BaseModel):
    periodo: str
    concluidas: int


class MetaRiscoItem(BaseModel):
    titulo: str
    setor: str
    status: str
    progresso: int
    prazo: str


# ---------- Espaço Setorial: metas ----------
class MetaCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    status: str = "nao_iniciada"
    progresso: int = 0
    prazo: date
    setor_id: Optional[int] = None  # obrigatório apenas para o perfil estratégico


class MetaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    setor_id: int
    titulo: str
    descricao: Optional[str] = None
    status: str
    progresso: int
    prazo: date


# ---------- Camada DLP / LGPD ----------
class DlpFinding(BaseModel):
    tipo: str
    orientacao: str


class MetaCriadaOut(BaseModel):
    meta: MetaOut
    dlp: list[DlpFinding]


# ---------- Métricas do setor ----------
class SetorMetricasOut(BaseModel):
    setor_id: int
    setor: str
    missao: str = ""
    objetivos: str = ""
    total_metas: int
    metas_concluidas: int
    pct_metas_concluidas: float
    metas_em_risco: int
    demandas_abertas: int
    demandas_concluidas: int
    valor_previsto: float
    valor_aplicado: float
    pct_recursos_aplicados: float
    metas_por_status: list[MetasPorSetorItem]
    resumo_gestor: str


# ---------- Chatbot ----------
class ChatRequest(BaseModel):
    mensagem: str
    contexto: Optional[str] = None


class ChatResponse(BaseModel):
    resposta: str
