"""Configuração do banco SQLite via SQLModel."""
from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./vddig.db"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    """Cria as tabelas (idempotente)."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependência do FastAPI: abre uma sessão por requisição."""
    with Session(engine) as session:
        yield session
