"""Ponto de entrada da API do Ecossistema vddig (ENSP/Fiocruz)."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import auth, bussola, chat, dashboard, setor, setores
from .seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed()
    yield


app = FastAPI(
    title="Ecossistema vddig — API",
    description="Plataforma de governança e gestão do conhecimento — ENSP/Fiocruz",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(setores.router)
app.include_router(dashboard.router)
app.include_router(setor.router)
app.include_router(chat.router)
app.include_router(bussola.router)


@app.get("/")
def root():
    return {"status": "ok", "servico": "Ecossistema vddig API"}
