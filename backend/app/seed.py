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
        "responsavel": "Rodrigo Sá de Alverga",
        "missao": "Coordenar o planejamento e o desenvolvimento institucional, alinhando "
                  "o Plano Quadrienal da ENSP ao da Fiocruz e disseminando o pensamento "
                  "estratégico.",
        "objetivos": "Subsidiar a construção, o acompanhamento e a avaliação do plano "
                     "institucional, coordenar indicadores de desempenho e apoiar a "
                     "formulação estratégica.",
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
        "sigla": "SEOF",
        "slug": "financas",
        "responsavel": "Marcelo Jacomo Lemos",
        "missao": "Coordenar e controlar a execução orçamentária e financeira dos "
                  "recursos da ENSP, fornecendo informações para a tomada de decisão.",
        "objetivos": "Registrar os atos contábeis no Siafi, corrigir inconsistências, "
                     "gerir diárias e passagens, executar pagamentos e controlar créditos.",
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
        "sigla": "GESCON",
        "slug": "contratos",
        "responsavel": "Rafaela dos Santos Silva",
        "missao": "Gerenciar administrativamente os contratos de serviços continuados "
                  "da ENSP, do cadastramento à supervisão.",
        "objetivos": "Analisar as informações contratuais, orientar a fiscalização, "
                     "avaliar medições, aplicar penalidades e gerir repactuações, "
                     "acréscimos e supressões.",
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
        "responsavel": "Simone Delmondes Moreira",
        "missao": "Gerir de forma centralizada os materiais e EPIs da instituição — "
                  "recebimento, armazenagem e fornecimento aos setores requisitantes.",
        "objetivos": "Receber e armazenar materiais, abastecer os setores, controlar "
                     "cadastros (CATMAT/SIAD) e gerir produtos controlados e o "
                     "desfazimento de materiais.",
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
        "responsavel": "Levi Jefferson Batista",
        "missao": "Atender com excelência às demandas dos usuários internos, criando "
                  "procedimentos e controles para a gestão dos bens patrimoniais.",
        "objetivos": "Coordenar os inventários de bens móveis e imóveis, os processos "
                     "de incorporação e desincorporação e manter atualizada a situação "
                     "patrimonial da instituição.",
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
        "responsavel": "Marivaldo Vitorino dos Santos Silva",
        "missao": "Gerir a manutenção predial, os equipamentos e os serviços de "
                  "condomínio, definindo diretrizes técnicas de infraestrutura.",
        "objetivos": "Coordenar e executar a manutenção e os equipamentos prediais, "
                     "acompanhar a limpeza, supervisionar serviços de engenharia e "
                     "gerir os materiais da área.",
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
        "sigla": "SGT",
        "slug": "trabalho",
        "responsavel": "Andrea Marcia de Oliveira Couto",
        "missao": "Planejar, coordenar, executar e avaliar as ações de administração "
                  "de pessoal, desenvolvimento humano e qualidade de vida no trabalho.",
        "objetivos": "Alinhar a gestão de pessoas às políticas estratégicas da Fiocruz, "
                     "promovendo o desenvolvimento e o bem-estar dos servidores.",
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
        "sigla": "SGQ",
        "slug": "qualidade",
        "responsavel": "Leticia Alves da Silva",
        "missao": "Coordenar a implementação do sistema de gestão da qualidade, em "
                  "consonância com a política da qualidade da ENSP.",
        "objetivos": "Subsidiar o Comitê Gestor da Qualidade, implementar a gestão por "
                     "processos e auxiliar as subunidades na definição de indicadores.",
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
        "responsavel": "Flávia Ramos Guimarães",
        "missao": "Formular e implementar as políticas de sustentabilidade da ENSP, "
                  "integrando critérios socioambientais ao planejamento institucional.",
        "objetivos": "Definir e monitorar indicadores de sustentabilidade, coordenar "
                     "ações sustentáveis e disseminar essa cultura internamente.",
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
        "sigla": "SEBIO",
        "slug": "biosseguranca",
        "responsavel": "Deborah Chein",
        "missao": "Coordenar a formulação das políticas de biossegurança da ENSP e "
                  "disseminar a cultura de prevenção de riscos e de boas práticas.",
        "objetivos": "Elaborar políticas de biossegurança, integrar normas ao "
                     "planejamento, definir indicadores, capacitar profissionais e "
                     "implementar medidas de saúde e segurança.",
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
