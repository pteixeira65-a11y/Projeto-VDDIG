"""Schemas Pydantic de entrada/saída da API."""
from datetime import date, datetime
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


class RecuperarSenhaRequest(BaseModel):
    email: str


class RecuperarSenhaResponse(BaseModel):
    ok: bool = True
    # Código que, em produção, iria por e-mail. Exposto apenas no protótipo
    # (ainda sem servidor de e-mail/SMTP). None quando o e-mail não existe.
    codigo_dev: Optional[str] = None


class RedefinirSenhaRequest(BaseModel):
    email: str
    codigo: str
    nova_senha: str


class SetorOut(BaseModel):
    id: int
    nome: str
    sigla: str = ""
    responsavel: str = ""
    missao: str = ""
    objetivos: str = ""


class TermoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    termo: str
    sigla: str = ""
    categoria: str
    definicao: str
    exemplo: str = ""
    fonte: str = ""
    sinonimos: str = ""


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


class ResumoSetorItem(BaseModel):
    """Resumo consolidado de um setor para o painel de saúde da Direção."""
    setor_id: int
    sigla: str
    nome: str
    total_metas: int
    metas_concluidas: int
    pct_metas_concluidas: float
    metas_em_risco: int
    valor_previsto: float
    valor_aplicado: float
    pct_recursos_aplicados: float


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
    responsavel: str = ""
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


# ---------- Transcrição e documentos (Gestão da Qualidade e demais setores) ----------
class TranscricaoOut(BaseModel):
    texto: str
    modo: str  # "simulado" | "real" — transparência para a demonstração


class GerarDocRequest(BaseModel):
    tipo: str  # resumo | ata | relatorio | mapeamento_processo
    transcricao: str
    setor: Optional[str] = None


class DocumentoOut(BaseModel):
    tipo: str
    documento: str


class RegistroCreate(BaseModel):
    titulo: str
    origem: str = "reuniao"
    setor: str = ""
    documento_tipo: str = ""
    transcricao: str = ""
    documento: str = ""


class RegistroOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    titulo: str
    origem: str
    setor: str
    documento_tipo: str
    transcricao: str
    documento: str
    criado_em: datetime
