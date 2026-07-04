# Ecossistema de Gestão e IA da vddig — ENSP/Fiocruz

Plataforma web de **governança e gestão do conhecimento** para o serviço público (ENSP/Fiocruz),
com foco na gestão de verbas **LOAS**. Já implementados dois módulos:

1. **Visão Estratégica / Dashboard Consolidado** — Direção, Coordenação, Assessores e vddig.
2. **Espaço Setorial** — cada funcionário cadastra metas e vê as métricas do seu setor, com
   **camada de conscientização LGPD (DLP)** e **assistente (chatbot)** de ajuda.

## Arquitetura

- **Backend:** FastAPI + SQLModel sobre SQLite. Autenticação JWT e controle de acesso por papel
  (RBAC): `estrategico` (dashboard) e `funcionario` (espaço do próprio setor).
- **Frontend:** React + Vite + TypeScript, gráficos com Recharts.
- **IA (simulada):** adaptador em `app/ai/agent.py` — resumo do gestor + assistente baseado em
  regras (ajuda de uso e orientação LGPD). Pronto para trocar por Claude API.
- **Camada DLP/LGPD:** `app/dlp.py` (+ `frontend/src/utils/dlp.ts`) detecta CPF, CNPJ, e-mail,
  telefone e termos sensíveis, dispara **alerta de conscientização** (não bloqueia) e abre o
  chatbot para orientar a anonimização.

```
fiocruz_ai/
├── backend/
│   ├── app/
│   │   ├── main.py          # app FastAPI + CORS + startup (cria/seed do banco)
│   │   ├── database.py      # engine SQLite
│   │   ├── models.py        # Setor, User, Meta, Demanda, RecursoLOAS
│   │   ├── schemas.py       # respostas da API
│   │   ├── auth.py          # JWT, hashing, RBAC
│   │   ├── seed.py          # dados de exemplo (setores, usuários, metas...)
│   │   ├── dlp.py           # detecção de dados sensíveis (LGPD)
│   │   ├── routers/         # auth, setores, dashboard, setor, chat
│   │   └── ai/agent.py      # IA simulada (resumo + assistente)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/           # Login, Dashboard, EspacoSetorial
        ├── components/      # KpiCard, *Chart, NovaMetaForm, Chatbot...
        └── utils/           # dlp.ts, formato.ts
```

## Como rodar

### 1) Backend (Python 3.9+)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API: <http://localhost:8000>  ·  Docs (Swagger): <http://localhost:8000/docs>
- No primeiro start, o banco `vddig.db` é criado e populado automaticamente.

### 2) Frontend (Node 18+)

```bash
cd frontend
npm install
npm run dev
```

- App: <http://localhost:5173> (o backend precisa estar rodando na porta 8000).

## Usuários de teste

Todos com a senha **`fiocruz123`**.

| Papel        | Email                                   | Acesso                              |
| ------------ | --------------------------------------- | ----------------------------------- |
| Estratégico  | `direcao@ensp.fiocruz.br`               | Dashboard consolidado + qualquer setor |
| Estratégico  | `coordenadora@ensp.fiocruz.br`          | Dashboard consolidado               |
| Estratégico  | `planejamento@ensp.fiocruz.br`          | Dashboard consolidado               |
| Funcionário  | `servidor.compras@ensp.fiocruz.br`      | Espaço Setorial — Compras           |
| Funcionário  | `servidor.biosseguranca@ensp.fiocruz.br`| Espaço Setorial — Biossegurança     |
| Funcionário  | `servidor.patrimonio@ensp.fiocruz.br`   | Espaço Setorial — Patrimônio        |
| Funcionário  | `servidor.planejamento@ensp.fiocruz.br` | Espaço Setorial — Planejamento      |
| Funcionário  | `servidor.riscos@ensp.fiocruz.br`       | Espaço Setorial — Riscos            |

> O funcionário só vê/edita o próprio setor; tentativas no dashboard estratégico retornam **403**.

## Endpoints principais

- **Auth:** `POST /api/login` · `GET /api/me` · `GET /api/setores`
- **Dashboard (estratégico):** `GET /api/dashboard/{kpis, metas-por-setor, recursos, demandas-timeline, metas-em-risco}` — aceitam `?setor_id=`
- **Espaço Setorial:** `GET /api/setor/metricas` · `GET /api/setor/metas` · `POST /api/setor/metas` · `DELETE /api/setor/metas/{id}`
  (funcionário opera no próprio setor; estratégico usa `?setor_id=`)
- **Assistente:** `POST /api/chat` — `{ mensagem, contexto? }`

## Camada LGPD / DLP

Ao digitar/salvar uma meta, o sistema analisa o texto e, se encontrar dado sensível (ex.: CPF,
e-mail, "sigiloso"), mostra um **alerta de conscientização** — sem bloquear — e oferece um botão
que abre o assistente com orientações de anonimização. A verificação roda no cliente (instantânea)
e também no servidor ao criar a meta (`POST /api/setor/metas` retorna os achados em `dlp`).

## IA (simulada) → Claude API real

A IA é **mock** (sem custo, sem chave). O módulo `app/ai/agent.py` mantém a assinatura da versão
real; para plugar a Claude basta instalar o SDK `anthropic` e usar uma chave do **Anthropic
Console** (`console.anthropic.com`).

> ⚠️ O plano **Claude Pro ($20/mês) não inclui API** — o acesso à API é cobrado por uso, à parte.

## Roadmap (próximas fases)

- **Repositório de Sucesso**: área transversal e colaborativa de boas práticas.
- **Busca inteligente** na base documental do setor.
- **RAG real por setor** com Claude API e validação humana (human-in-the-loop), substituindo o
  assistente mock por um agente alimentado pelas normativas de cada área.
