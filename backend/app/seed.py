"""Popula o banco com dados simulados de demonstração (idempotente)."""
import random
from datetime import date, timedelta

from sqlmodel import Session, select

from .auth import hash_senha
from .database import engine
from .models import Demanda, Meta, RecursoLOAS, Setor, Termo, User

SETORES = ["Compras", "Biossegurança", "Patrimônio", "Planejamento", "Riscos"]

# Missão e objetivos mínimos de cada setor (contexto ENSP/Fiocruz — governança LOAS).
DESCRICOES = {
    "Compras": {
        "missao": "Prover à ENSP aquisições e contratações públicas eficientes, "
                  "transparentes e em conformidade com a legislação.",
        "objetivos": "Reduzir prazos de contratação, assegurar conformidade legal e "
                     "otimizar a aplicação dos recursos LOAS em compras e contratos.",
    },
    "Biossegurança": {
        "missao": "Assegurar ambientes de trabalho e pesquisa seguros, protegendo "
                  "pessoas, comunidade e meio ambiente contra riscos biológicos.",
        "objetivos": "Manter protocolos de biossegurança atualizados, capacitar as "
                     "equipes e monitorar a conformidade das instalações.",
    },
    "Patrimônio": {
        "missao": "Zelar pela gestão, pelo controle e pela preservação dos bens "
                  "públicos sob responsabilidade da ENSP.",
        "objetivos": "Manter o inventário atualizado, controlar a movimentação de "
                     "bens e maximizar o aproveitamento dos ativos.",
    },
    "Planejamento": {
        "missao": "Coordenar o planejamento estratégico e orçamentário, alinhando as "
                  "metas setoriais aos objetivos institucionais.",
        "objetivos": "Consolidar indicadores, acompanhar a execução das metas e apoiar "
                     "decisões baseadas em dados.",
    },
    "Riscos": {
        "missao": "Fortalecer a governança institucional por meio da identificação, "
                  "avaliação e mitigação de riscos.",
        "objetivos": "Mapear riscos críticos, monitorar os planos de tratamento e "
                     "disseminar a cultura de gestão de riscos.",
    },
}

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


def _seed_operacional() -> None:
    with Session(engine) as s:
        if s.exec(select(Setor)).first():
            return  # já populado

        random.seed(42)

        setores: dict[str, Setor] = {}
        for nome in SETORES:
            desc = DESCRICOES.get(nome, {})
            setor = Setor(nome=nome, missao=desc.get("missao", ""),
                          objetivos=desc.get("objetivos", ""))
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


# --- Glossário da "Bússola do Saber" (linguagem simples, sem jargão) ---
GLOSSARIO = [
    {"termo": "LOAS", "sigla": "LOAS", "categoria": "normativo",
     "definicao": "Lei Orgânica da Assistência Social. Define quem tem direito à "
                  "assistência social no Brasil e como os recursos são aplicados.",
     "exemplo": "As verbas LOAS acompanhadas na plataforma seguem essa lei.",
     "fonte": "Lei nº 8.742/1993",
     "sinonimos": "lei organica assistencia social, verba loas, recurso assistencial"},
    {"termo": "LGPD", "sigla": "LGPD", "categoria": "normativo",
     "definicao": "Lei Geral de Proteção de Dados. Regras para coletar, usar e guardar "
                  "dados pessoais com segurança e transparência.",
     "exemplo": "Ao digitar um CPF numa meta, a plataforma alerta por causa da LGPD.",
     "fonte": "Lei nº 13.709/2018",
     "sinonimos": "protecao de dados, privacidade, dados pessoais"},
    {"termo": "DLP (prevenção de vazamento)", "sigla": "DLP", "categoria": "ia",
     "definicao": "Camada que identifica dados sensíveis (CPF, e-mail, telefone) no texto "
                  "e avisa antes que sejam expostos indevidamente.",
     "exemplo": "O alerta amarelo ao salvar uma meta vem da camada DLP.",
     "fonte": "", "sinonimos": "prevencao de vazamento, data loss prevention, alerta de dados sensiveis"},
    {"termo": "RAG (busca aumentada)", "sigla": "RAG", "categoria": "ia",
     "definicao": "Técnica em que a IA consulta documentos confiáveis antes de responder, "
                  "reduzindo erros e citando a fonte.",
     "exemplo": "O assistente usará RAG para responder com base nas normas do setor.",
     "fonte": "", "sinonimos": "retrieval augmented generation, busca aumentada, geracao aumentada"},
    {"termo": "RBAC (acesso por papel)", "sigla": "RBAC", "categoria": "gestao",
     "definicao": "Controle de acesso por papel: cada usuário vê apenas o que seu perfil "
                  "permite.",
     "exemplo": "Um funcionário só acessa o próprio setor; a Direção vê todos.",
     "fonte": "", "sinonimos": "controle de acesso, permissao por perfil, papel de usuario"},
    {"termo": "Revisão humana (human-in-the-loop)", "sigla": "", "categoria": "ia",
     "definicao": "A IA sugere, mas uma pessoa revisa e aprova antes de o resultado ser usado.",
     "exemplo": "Uma minuta gerada pela IA passa por revisão humana antes de valer.",
     "fonte": "", "sinonimos": "human in the loop, validacao humana, humano no circuito, revisao humana"},
    {"termo": "Anonimização", "sigla": "", "categoria": "normativo",
     "definicao": "Remover ou mascarar dados que identificam uma pessoa, para proteger a "
                  "privacidade.",
     "exemplo": "Trocar o CPF por 'servidor do setor' é anonimizar.",
     "fonte": "LGPD, art. 12", "sinonimos": "anonimizar, mascarar dados, despersonalizar"},
    {"termo": "KPI (indicador)", "sigla": "KPI", "categoria": "gestao",
     "definicao": "Indicador-chave que mostra rapidamente como algo vai, em número.",
     "exemplo": "'% de metas concluídas' é um KPI do painel.",
     "fonte": "", "sinonimos": "indicador, metrica, key performance indicator"},
    {"termo": "Meta", "sigla": "", "categoria": "gestao",
     "definicao": "Objetivo do setor com prazo e progresso acompanhados na plataforma.",
     "exemplo": "'Concluir o inventário até dezembro' é uma meta.",
     "fonte": "", "sinonimos": "objetivo, meta setorial"},
    {"termo": "Demanda", "sigla": "", "categoria": "gestao",
     "definicao": "Solicitação ou tarefa registrada pelo setor, com status e prioridade.",
     "exemplo": "Um pedido de compra em aberto é uma demanda.",
     "fonte": "", "sinonimos": "solicitacao, tarefa, chamado"},
    {"termo": "Meta em risco", "sigla": "", "categoria": "gestao",
     "definicao": "Meta atrasada ou que passou do prazo sem ser concluída.",
     "exemplo": "Uma meta com prazo vencido aparece como 'em risco'.",
     "fonte": "", "sinonimos": "meta atrasada, risco de meta, fora do prazo"},
    {"termo": "ENSP", "sigla": "ENSP", "categoria": "gestao",
     "definicao": "Escola Nacional de Saúde Pública Sergio Arouca, unidade da Fiocruz.",
     "exemplo": "A plataforma vddig atende a gestão da ENSP.",
     "fonte": "", "sinonimos": "escola nacional de saude publica"},
    {"termo": "Fiocruz", "sigla": "", "categoria": "gestao",
     "definicao": "Fundação Oswaldo Cruz, instituição pública de ciência e saúde ligada ao "
                  "Ministério da Saúde.",
     "exemplo": "A ENSP faz parte da Fiocruz.",
     "fonte": "", "sinonimos": "fundacao oswaldo cruz"},
    {"termo": "JWT (token de acesso)", "sigla": "JWT", "categoria": "ia",
     "definicao": "Credencial digital que comprova quem é o usuário logado durante a sessão.",
     "exemplo": "Ao entrar, você recebe um token que autentica suas ações.",
     "fonte": "", "sinonimos": "token, autenticacao, json web token"},
]


def _seed_glossario() -> None:
    with Session(engine) as s:
        if s.exec(select(Termo)).first():
            return  # glossário já populado
        for t in GLOSSARIO:
            s.add(Termo(**t))
        s.commit()


def seed() -> None:
    _seed_operacional()
    _seed_glossario()
