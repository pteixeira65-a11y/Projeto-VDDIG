"""Popula o banco com dados simulados de demonstração (idempotente)."""
import random
from datetime import date, timedelta

from sqlmodel import Session, select

from .auth import hash_senha
from .database import engine
from .models import Demanda, Meta, RecursoLOAS, Setor, Termo, User

# Data de referência do sistema (usada também nos cálculos de "em risco").
HOJE = date(2026, 7, 4)

SENHA_PADRAO = "fiocruz123"

# Setores/serviços vinculados à VDDIG (Vice-Direção de Desenvolvimento
# Institucional e Gestão) — ENSP/Fiocruz. Cada setor tem nome oficial,
# sigla curta (para os gráficos), missão, objetivos e um conjunto de metas.
SETORES = [
    {
        "nome": "Serviço de Planejamento (SEPLAN)",
        "sigla": "SEPLAN",
        "slug": "seplan",
        "missao": "Coordenar o planejamento estratégico e orçamentário da VDDIG, "
                  "alinhando as metas setoriais aos objetivos institucionais.",
        "objetivos": "Consolidar indicadores, acompanhar a execução das metas e "
                     "apoiar decisões baseadas em dados.",
        "metas": [
            "Consolidar o Plano Anual de Trabalho 2026",
            "Revisar os indicadores institucionais do PDI",
            "Publicar o relatório de gestão do 1º semestre",
            "Implantar painel de monitoramento de metas",
            "Alinhar as metas setoriais ao planejamento da ENSP",
            "Capacitar as equipes em planejamento estratégico",
        ],
    },
    {
        "nome": "Serviço de Orçamento e Finanças",
        "sigla": "Finanças",
        "slug": "financas",
        "missao": "Planejar, executar e controlar os recursos orçamentários e "
                  "financeiros com transparência e conformidade.",
        "objetivos": "Garantir a execução orçamentária, otimizar a aplicação dos "
                     "recursos LOAS e assegurar a prestação de contas.",
        "metas": [
            "Executar o orçamento aprovado para 2026",
            "Reduzir os restos a pagar do exercício anterior",
            "Conciliar as prestações de contas dos convênios",
            "Automatizar o controle de empenhos",
            "Elaborar a previsão orçamentária do 2º semestre",
        ],
    },
    {
        "nome": "Serviço de Gestão de Contratos",
        "sigla": "Contratos",
        "slug": "contratos",
        "missao": "Gerir o ciclo de vida dos contratos administrativos, assegurando "
                  "conformidade legal e eficiência.",
        "objetivos": "Reduzir riscos contratuais, acompanhar a execução e otimizar "
                     "os prazos de renovação.",
        "metas": [
            "Revisar os contratos com vigência a vencer",
            "Implantar rotina de fiscalização de contratos",
            "Digitalizar o acervo de contratos ativos",
            "Renovar os contratos de serviços essenciais",
            "Capacitar os fiscais de contrato",
        ],
    },
    {
        "nome": "Serviço de Gestão de Materiais (SEGEM)",
        "sigla": "SEGEM",
        "slug": "segem",
        "missao": "Assegurar o suprimento de materiais com eficiência, evitando "
                  "desperdícios e rupturas de estoque.",
        "objetivos": "Manter o estoque equilibrado, controlar entradas e saídas e "
                     "otimizar as aquisições.",
        "metas": [
            "Realizar o inventário anual do almoxarifado",
            "Reduzir a ruptura de estoque de itens críticos",
            "Implantar sistema de requisição eletrônica",
            "Padronizar o catálogo de materiais",
            "Revisar os níveis mínimos de estoque",
        ],
    },
    {
        "nome": "Serviço de Gestão Patrimonial (SGPAT)",
        "sigla": "SGPAT",
        "slug": "sgpat",
        "missao": "Zelar pela gestão, pelo controle e pela preservação dos bens "
                  "públicos sob responsabilidade da ENSP.",
        "objetivos": "Manter o inventário atualizado, controlar a movimentação de "
                     "bens e maximizar o aproveitamento dos ativos.",
        "metas": [
            "Atualizar o inventário patrimonial",
            "Concluir o desfazimento de bens inservíveis",
            "Identificar os bens com QR Code",
            "Regularizar os termos de responsabilidade",
            "Mapear os bens não localizados",
        ],
    },
    {
        "nome": "Serviço de Infraestrutura (SEINFRA)",
        "sigla": "SEINFRA",
        "slug": "seinfra",
        "missao": "Manter e desenvolver a infraestrutura física, garantindo "
                  "instalações seguras e funcionais.",
        "objetivos": "Priorizar a manutenção preventiva, reduzir falhas e melhorar "
                     "a eficiência das instalações.",
        "metas": [
            "Executar o plano de manutenção predial preventiva",
            "Modernizar a rede elétrica do bloco principal",
            "Reduzir os chamados de manutenção corretiva",
            "Implantar medidas de eficiência energética",
            "Revisar os sistemas de climatização",
        ],
    },
    {
        "nome": "Serviço de Gestão do Trabalho",
        "sigla": "Trabalho",
        "slug": "trabalho",
        "missao": "Promover a gestão de pessoas com foco no desenvolvimento, no "
                  "bem-estar e na valorização dos servidores.",
        "objetivos": "Aprimorar os processos de gestão do trabalho, capacitar as "
                     "equipes e melhorar o clima organizacional.",
        "metas": [
            "Atualizar o dimensionamento da força de trabalho",
            "Implantar programa de qualidade de vida",
            "Revisar os fluxos de admissão e desligamento",
            "Mapear as competências das equipes",
            "Reduzir o prazo das movimentações funcionais",
        ],
    },
    {
        "nome": "Serviço de Gestão da Qualidade",
        "sigla": "Qualidade",
        "slug": "qualidade",
        "missao": "Promover a melhoria contínua dos processos, com foco em "
                  "eficiência e na satisfação dos usuários.",
        "objetivos": "Padronizar processos, monitorar indicadores de qualidade e "
                     "tratar as não conformidades.",
        "metas": [
            "Mapear e padronizar os processos críticos",
            "Implantar indicadores de qualidade por setor",
            "Realizar auditorias internas de processos",
            "Publicar o manual de boas práticas",
            "Reduzir as não conformidades recorrentes",
        ],
    },
    {
        "nome": "Serviço de Gestão da Sustentabilidade (SGS)",
        "sigla": "SGS",
        "slug": "sustentabilidade",
        "missao": "Integrar a sustentabilidade à gestão institucional, promovendo "
                  "práticas ambientais responsáveis.",
        "objetivos": "Reduzir impactos ambientais, promover o uso racional de "
                     "recursos e engajar as equipes.",
        "metas": [
            "Implantar a coleta seletiva em todos os prédios",
            "Reduzir o consumo de água e de energia",
            "Elaborar o plano de logística sustentável",
            "Promover campanha de descarte consciente",
            "Medir a pegada de carbono institucional",
        ],
    },
    {
        "nome": "Serviço de Biossegurança",
        "sigla": "Biosseg.",
        "slug": "biosseguranca",
        "missao": "Assegurar ambientes de trabalho e pesquisa seguros, protegendo "
                  "pessoas, comunidade e meio ambiente contra riscos biológicos.",
        "objetivos": "Manter protocolos atualizados, capacitar as equipes e "
                     "monitorar a conformidade das instalações.",
        "metas": [
            "Revisar os protocolos de biossegurança dos laboratórios",
            "Capacitar as equipes no manejo de resíduos",
            "Atualizar o mapa de riscos biológicos",
            "Auditar as cabines de segurança biológica",
            "Implantar plano de resposta a incidentes",
        ],
    },
    {
        "nome": "POLEM — Laboratório de Inovação em Gestão Pública",
        "sigla": "POLEM",
        "slug": "polem",
        "missao": "Fomentar a inovação na gestão pública por meio de experimentação, "
                  "prototipagem e colaboração.",
        "objetivos": "Testar soluções, disseminar boas práticas e apoiar a "
                     "transformação dos serviços da VDDIG.",
        "metas": [
            "Prototipar solução de gestão para a VDDIG",
            "Realizar oficinas de inovação com os setores",
            "Mapear as jornadas e dores dos usuários internos",
            "Implantar projeto-piloto de automação",
            "Disseminar a cultura de inovação na gestão",
        ],
    },
    {
        "nome": "Serviço de Compras",
        "sigla": "Compras",
        "slug": "compras",
        "responsavel": "Tatiana Moreira da Silva",
        "missao": "Planejar e executar as aquisições e contratações públicas da ENSP, "
                  "com transparência e em conformidade com a Lei nº 14.133/2021.",
        "objetivos": "Consolidar o Plano de Contratações Anual (PCA), apoiar ETPs, "
                     "matriz de riscos e termos de referência, conduzir licitações, "
                     "dispensas e inexigibilidades e formalizar/publicar os atos.",
        "metas": [
            "Consolidar o Plano de Contratações Anual (PCA) 2026",
            "Apoiar a elaboração de Estudos Técnicos Preliminares e Termos de Referência",
            "Realizar a pesquisa de preços conforme a IN 65/2021",
            "Conduzir licitações e dispensas no formato eletrônico",
            "Publicar e arquivar os atos oficiais das contratações",
        ],
    },
    {
        "nome": "Serviço de Gestão da Tecnologia da Informação (SGTI)",
        "sigla": "SGTI",
        "slug": "sgti",
        "responsavel": "Marcus Vinicius Del Sarto",
        "missao": "Planejar, acompanhar e fortalecer as ações de tecnologia da "
                  "informação da ENSP, com base em governança e boas práticas (COBIT).",
        "objetivos": "Manter a infraestrutura, os computadores e as redes locais, "
                     "prover suporte (help desk) a alunos e servidores e zelar pela "
                     "segurança da informação.",
        "metas": [
            "Modernizar a infraestrutura de rede local",
            "Reduzir o tempo de atendimento do help desk",
            "Renovar o parque de computadores prioritários",
            "Revisar a política de segurança da informação",
            "Implantar monitoramento dos serviços de TI",
        ],
    },
]

# Usuários com Visão Estratégica (Direção, Coordenação, Assessoria — VDDIG).
ESTRATEGICOS = [
    ("Direção ENSP", "direcao@ensp.fiocruz.br"),
    ("Coordenadora VDDIG", "coordenadora@ensp.fiocruz.br"),
    ("Assessor de Planejamento", "planejamento@ensp.fiocruz.br"),
]

STATUS_METAS = ["nao_iniciada", "em_andamento", "concluida", "atrasada"]


def _seed_operacional() -> None:
    with Session(engine) as s:
        if s.exec(select(Setor)).first():
            return  # já populado

        random.seed(42)

        # --- Setores ---
        setores: dict[str, Setor] = {}
        for cfg in SETORES:
            setor = Setor(nome=cfg["nome"], sigla=cfg["sigla"],
                          responsavel=cfg.get("responsavel", ""),
                          missao=cfg["missao"], objetivos=cfg["objetivos"])
            s.add(setor)
            s.commit()
            s.refresh(setor)
            setores[cfg["slug"]] = setor

        # --- Usuários estratégicos ---
        for nome, email in ESTRATEGICOS:
            s.add(User(nome=nome, email=email, senha_hash=hash_senha(SENHA_PADRAO),
                       role="estrategico", setor_id=None))

        # --- Um funcionário (Espaço Setorial) por setor ---
        for cfg in SETORES:
            setor = setores[cfg["slug"]]
            s.add(User(nome=f"Servidor(a) — {cfg['sigla']}",
                       email=f"servidor.{cfg['slug']}@ensp.fiocruz.br",
                       senha_hash=hash_senha(SENHA_PADRAO), role="funcionario",
                       setor_id=setor.id))
        s.commit()

        # --- Metas, demandas e recursos por setor ---
        for cfg in SETORES:
            setor = setores[cfg["slug"]]

            titulos = cfg["metas"][:]
            random.shuffle(titulos)
            quantidade = min(len(titulos), random.randint(4, 6))
            for titulo in titulos[:quantidade]:
                st = random.choices(STATUS_METAS, weights=[1, 3, 3, 2])[0]
                progresso = {
                    "nao_iniciada": 0,
                    "em_andamento": random.randint(20, 80),
                    "concluida": 100,
                    "atrasada": random.randint(10, 60),
                }[st]
                prazo = HOJE + timedelta(days=random.randint(-30, 120))
                s.add(Meta(setor_id=setor.id, titulo=titulo,
                           descricao=f"Ação institucional do {cfg['sigla']}.",
                           status=st, progresso=progresso, prazo=prazo))

            # Demandas ao longo dos últimos 6 meses
            for m in range(6):
                inicio_mes = date(2026, 1 + m, 1)
                for j in range(random.randint(3, 12)):
                    criada = inicio_mes + timedelta(days=random.randint(0, 25))
                    st = random.choices(["aberta", "em_andamento", "concluida"],
                                        weights=[2, 2, 5])[0]
                    concluida = None
                    if st == "concluida":
                        concluida = criada + timedelta(days=random.randint(2, 20))
                    s.add(Demanda(setor_id=setor.id,
                                  titulo=f"Demanda {cfg['sigla']} {m + 1}-{j + 1}",
                                  status=st, prioridade=random.choice(["baixa", "media", "alta"]),
                                  criada_em=criada, concluida_em=concluida))

            # Recursos LOAS (previsto x aplicado)
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
