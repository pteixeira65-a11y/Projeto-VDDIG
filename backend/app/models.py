"""Modelos de dados (tabelas SQLModel)."""
from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel


class Setor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    sigla: str = Field(default="")       # rótulo curto (usado nos gráficos)
    responsavel: str = Field(default="") # chefia/coordenação do setor
    missao: str = Field(default="")      # missão institucional do setor
    objetivos: str = Field(default="")   # objetivos/competências principais


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(index=True, unique=True)
    senha_hash: str
    role: str  # "estrategico" | "funcionario"
    setor_id: Optional[int] = Field(default=None, foreign_key="setor.id")


class Meta(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    setor_id: int = Field(foreign_key="setor.id")
    titulo: str
    descricao: Optional[str] = Field(default=None)
    status: str  # nao_iniciada | em_andamento | concluida | atrasada
    progresso: int  # 0-100
    prazo: date


class Demanda(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    setor_id: int = Field(foreign_key="setor.id")
    titulo: str
    status: str  # aberta | em_andamento | concluida
    prioridade: str  # baixa | media | alta
    criada_em: date
    concluida_em: Optional[date] = None


class RecursoLOAS(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    setor_id: int = Field(foreign_key="setor.id")
    categoria: str
    valor_previsto: float
    valor_aplicado: float
    periodo: str  # ex.: "2026"


class Termo(SQLModel, table=True):
    """Verbete do glossário da 'Bússola do Saber'."""
    id: Optional[int] = Field(default=None, primary_key=True)
    termo: str
    sigla: str = Field(default="")
    categoria: str  # normativo | gestao | ia
    definicao: str  # explicação em linguagem simples, sem jargão
    exemplo: str = Field(default="")
    fonte: str = Field(default="")
    sinonimos: str = Field(default="")  # variações p/ busca, separadas por vírgula
