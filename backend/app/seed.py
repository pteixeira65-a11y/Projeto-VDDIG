"""Popula o banco com dados simulados de demonstração (idempotente)."""
import random
from datetime import date, timedelta

from sqlmodel import Session, select

from .auth import hash_senha
from .database import engine
from .models import Demanda, Meta, RecursoLOAS, Setor, User

SETORES = ["Compras", "Biossegurança", "Patrimônio", "Planejamento", "Riscos"]

# Slug para compor o e-mail do funcionário de cada setor.
FUNC_SLUG = {
    "Compras": "compras",
    "Biossegurança": "biosseguranca",
    "Patrimônio": "patrimonio",
    "Planejamento": "planejamento",
    "Riscos": "riscos",
}

# Data de referência do sistema (usada também nos cálculos de "em risco").
HOJE = date(2026, 7, 4)

SENHA_PADRAO = "fiocruz123"


def seed() -> None:
    with Session(engine) as s:
        if s.exec(select(Setor)).first():
            return  # já populado

        random.seed(42)

        setores: dict[str, Setor] = {}
        for nome in SETORES:
            setor = Setor(nome=nome)
            s.add(setor)
            s.commit()
            s.refresh(setor)
            setores[nome] = setor

        # --- Usuários com Visão Estratégica (Direção, Coordenação, Planejamento, vddig) ---
        estrategicos = [
            ("Direção ENSP", "direcao@ensp.fiocruz.br"),
            ("Coordenadora vddig", "coordenadora@ensp.fiocruz.br"),
            ("Assessor de Planejamento", "planejamento@ensp.fiocruz.br"),
        ]
        for nome, email in estrategicos:
            s.add(User(nome=nome, email=email, senha_hash=hash_senha(SENHA_PADRAO),
                       role="estrategico", setor_id=None))

        # Um funcionário (Espaço Setorial) por setor.
        for nome, setor in setores.items():
            s.add(User(nome=f"Servidor(a) — {nome}",
                       email=f"servidor.{FUNC_SLUG[nome]}@ensp.fiocruz.br",
                       senha_hash=hash_senha(SENHA_PADRAO), role="funcionario",
                       setor_id=setor.id))
        s.commit()

        status_metas = ["nao_iniciada", "em_andamento", "concluida", "atrasada"]
        for nome, setor in setores.items():
            # --- Metas ---
            for i in range(random.randint(4, 7)):
                st = random.choices(status_metas, weights=[1, 3, 3, 2])[0]
                progresso = {
                    "nao_iniciada": 0,
                    "em_andamento": random.randint(20, 80),
                    "concluida": 100,
                    "atrasada": random.randint(10, 60),
                }[st]
                prazo = HOJE + timedelta(days=random.randint(-30, 120))
                s.add(Meta(setor_id=setor.id, titulo=f"Meta {i + 1} — {nome}",
                           descricao=f"Ação institucional do setor {nome}.",
                           status=st, progresso=progresso, prazo=prazo))

            # --- Demandas ao longo dos últimos 6 meses ---
            for m in range(6):
                inicio_mes = date(2026, 1 + m, 1)
                for j in range(random.randint(3, 12)):
                    criada = inicio_mes + timedelta(days=random.randint(0, 25))
                    st = random.choices(["aberta", "em_andamento", "concluida"],
                                        weights=[2, 2, 5])[0]
                    concluida = None
                    if st == "concluida":
                        concluida = criada + timedelta(days=random.randint(2, 20))
                    s.add(Demanda(setor_id=setor.id, titulo=f"Demanda {nome} {m + 1}-{j + 1}",
                                  status=st, prioridade=random.choice(["baixa", "media", "alta"]),
                                  criada_em=criada, concluida_em=concluida))

            # --- Recursos LOAS (previsto x aplicado) ---
            previsto = random.randint(200, 900) * 1000
            aplicado = round(previsto * random.uniform(0.4, 0.95))
            s.add(RecursoLOAS(setor_id=setor.id, categoria="Custeio",
                              valor_previsto=previsto, valor_aplicado=aplicado, periodo="2026"))

        s.commit()
