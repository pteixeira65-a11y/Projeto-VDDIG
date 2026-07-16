# AGENT.md — Plataforma Adauto (Projeto VDDIG)

> **Para que serve este arquivo.** Ele é o "documento de embarque" do projeto: reúne
> **tudo o que é importante saber** para continuar o trabalho — o propósito, o jeito de
> trabalhar do dono do produto, a arquitetura, como rodar, o que já foi feito e o que falta.
>
> Ele existe porque parte do contexto vivia na **memória do Claude Code** (pasta `.claude/`,
> que **não** vai para o GitHub) e o dono do projeto vai **trocar de conta**. Este arquivo
> (mais a pasta [`docs/`](docs/)) garante que nada essencial se perca. **Qualquer assistente
> de IA ou pessoa que assumir o projeto deve ler este arquivo primeiro.**

---

## 1. O que é o projeto

**Plataforma Adauto** (nome de código histórico: **VDDIG** / "vddig") é uma **plataforma web de
governança e gestão do conhecimento** para o serviço público — especificamente a **VDDIG**
(Vice-Direção de Desenvolvimento Institucional e Gestão) da **ENSP/Fiocruz** (Escola Nacional de
Saúde Pública Sergio Arouca).

O objetivo é apoiar a **alta gestão** e os **servidores** dos setores administrativos com:
- painéis de indicadores e metas (visão estratégica e por setor),
- ferramentas de IA com **validação humana sempre** (human-in-the-loop),
- letramento (glossário, manuais) e conscientização **LGPD/DLP**,
- um portal institucional ("quem é quem") dos serviços da VDDIG.

**Estado atual: é um protótipo/simulação** — mas feito com a intenção de **virar uso real**.
Ver a diretriz "rumo à produção" na seção [Convenções](#11-convenções-importantes) e em
[`docs/decisoes-e-funcionalidades.md`](docs/decisoes-e-funcionalidades.md).

## 2. Os nomes têm significado (importante — trate com respeito)

O projeto nasce como **gratidão e legado**. Os nomes **não** são rótulos aleatórios:

- **Plataforma Adauto** homenageia **Adauto**, um grande diretor da ENSP que foi decisivo na
  trajetória profissional do dono do projeto (apoiou uma viagem dele à França, onde ele
  aprendeu e organizou um livro).
- A assistente **Duca** homenageia **Maria do Carmo, a "Duca"**, ex-diretora da ENSP.

**Cuidado:** a assistente Duca leva o nome e o jeito acolhedor da pessoa real, mas **não se passa
por ela** — identifica-se como assistente de IA e reforça que "a decisão é sempre humana". Vale um
OK institucional/da família para a homenagem.

## 3. Quem é o dono do produto e como trabalhar com ele

O dono do produto é o cliente destas sessões. Pontos essenciais (detalhe em
[`docs/como-trabalhamos.md`](docs/como-trabalhamos.md)):

- **Não é programador** — é o dono do produto. **Explique tudo de forma simples e direta**, sem
  jargão técnico.
- **Modelo híbrido de consulta:** em mudanças médias/grandes ou arriscadas, **alinhar antes de
  implementar**. Ajustes pequenos podem ir direto. Quando ele diz "pode fazer", avance rápido.
- **Modo consulta:** quando ele diz "quero consultar" ou está discutindo ideias, **não implemente**
  — só converse (opinião, opções, prós e contras) e implemente apenas com o comando explícito.
- **Ao terminar:** mostrar funcionando na tela → ele valida → **só então commitar**.
- **Ele é consciente de custo (tokens)** e quer aprender a ser eficiente. O custo vem mais de
  **quantas vezes você lê arquivos/roda ferramentas** do que do tamanho da conversa. Junte pedidos
  parecidos, alinhe antes (evita retrabalho), reaproveite o que já existe, seja específico na tela/arquivo.

## 4. Arquitetura e stack

| Camada | Tecnologia |
| --- | --- |
| **Frontend** | React 18 + Vite 6 + TypeScript; React Router; **Recharts** (gráficos); Axios |
| **Backend** | **FastAPI** + **SQLModel** sobre **SQLite** (`backend/vddig.db`) |
| **Auth** | JWT + hashing (passlib/python-jose) + **RBAC** por papel: `estrategico` e `funcionario` |
| **IA** | **Simulada (mock)** em `backend/app/ai/agent.py` — mesma assinatura da versão real; pronta para plugar a **Claude API** |
| **LGPD/DLP** | `backend/app/dlp.py` + `frontend/src/utils/dlp.ts` — detecta CPF/CNPJ/e-mail/telefone/termos sensíveis e **alerta** (não bloqueia) |
| **Transcrição** | `backend/app/transcricao.py` — modo `simulado` (padrão) ou `real` (faster-whisper local, CPU) |

Fluxo: o **frontend Vite (`:5173`)** fala com o **backend FastAPI (`:8000`)** via `/api/*`.
No primeiro start, o banco `vddig.db` é **criado e populado** automaticamente (`seed.py`).

## 5. Como rodar (local, Windows)

**Atalho (sobe backend + frontend em janelas separadas):**
```powershell
powershell -ExecutionPolicy Bypass -File .\run-local.ps1
```

**Manual:**
```bash
# Backend (Python 3.9+)
cd backend
python -m venv .venv
.\.venv\Scripts\activate           # Windows;  no Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (Node 18+)
cd frontend
npm install
npm run dev
```

- App: <http://localhost:5173>  ·  API: <http://localhost:8000>  ·  Swagger: <http://localhost:8000/docs>
- **Pegadinha do OneDrive:** o projeto vive numa pasta do OneDrive, o que **quebra o `--reload`** do
  uvicorn (o watcher de arquivos falha). Se o backend não recarregar sozinho, mate o processo e suba
  de novo com `run-local.ps1`.
- **Pegadinha do IPv6:** o Vite escuta em `[::1]`. `curl` em IPv4 pode dar 000 — use `localhost`.

## 6. Usuários de teste

Todos com a senha **`fiocruz123`**.

| Papel | E-mail | Acesso |
| --- | --- | --- |
| Estratégico | `direcao@ensp.fiocruz.br` | Sala de Situação + qualquer setor + Manual da Direção |
| Estratégico | `coordenadora@ensp.fiocruz.br` | Dashboard consolidado |
| Estratégico | `planejamento@ensp.fiocruz.br` | Dashboard consolidado |
| Funcionário | `servidor.<slug>@ensp.fiocruz.br` | Espaço do próprio setor (ver slugs na seção 7) |

Exemplos de funcionário: `servidor.compras@…`, `servidor.qualidade@…` (SGQ), `servidor.polem@…`,
`servidor.biosseguranca@…`. O funcionário só vê/edita o próprio setor; tentar o dashboard
estratégico retorna **403**.

## 7. Os 13 setores da VDDIG (seed)

Definidos em `backend/app/seed.py` (cada um tem sigla, slug, responsável, missão, objetivos e metas):

| Sigla | Slug (login) | Nome |
| --- | --- | --- |
| SEPLAN | `seplan` | Serviço de Planejamento |
| SEOF | `financas` | Serviço de Orçamento e Finanças |
| GESCON | `contratos` | Serviço de Gestão de Contratos |
| SEGEM | `segem` | Serviço de Gestão de Materiais |
| SGPAT | `sgpat` | Serviço de Gestão Patrimonial |
| SEINFRA | `seinfra` | Serviço de Infraestrutura |
| SGT | `trabalho` | Serviço de Gestão do Trabalho |
| SGQ | `qualidade` | Serviço de Gestão da Qualidade |
| SGS | `sustentabilidade` | Serviço de Gestão da Sustentabilidade |
| SEBIO | `biosseguranca` | Serviço de Biossegurança |
| POLEM | `polem` | POLEM — Laboratório de Inovação em Gestão Pública |
| Compras | `compras` | Serviço de Compras |
| SGTI | `sgti` | Serviço de Gestão da Tecnologia da Informação |

Alguns setores têm **abas exclusivas** (ver seção 8): **POLEM** → Blueprints; **SGQ** →
Mapeamento·Qualidade; **Compras** → Gestão de Riscos.

## 8. Mapa de funcionalidades (o que já existe)

Todas as rotas (menos `/login`, `/recuperar-senha`, `/colabora`) exigem login. Rotas em `App.tsx`.

- **Sala de Situação / Curadoria (`/curadoria`, `CuradoriaIAs.tsx`)** — o **espaço de trabalho
  principal**, em abas. É onde a Direção e os servidores realmente trabalham. Contém: Colabora AI,
  Dashboard, Gravação→Ata, Repositório, Ferramentas de IA, Banco de Prompts, Bússola, Manual e as
  abas condicionais por setor (Blueprints/POLEM, Mapeamento/SGQ, Gestão de Riscos/Compras).
  ⚠️ **É aqui que se integram novas features.** (`/colabora`, `ColaboraAI.tsx`, é uma página
  **órfã/solta** — nada no menu leva a ela; **não** desenvolver lá.)
- **Dashboard estratégico (`/dashboard`)** — KPIs consolidados, metas por setor, recursos LOAS,
  timeline de demandas, metas em risco. Aceita `?setor_id=`.
- **Espaço Setorial (`/setor`)** — o servidor cadastra metas e vê métricas do seu setor, com
  camada de conscientização LGPD e o assistente.
- **Blueprints dos 13 setores** — Service Blueprints (etapas × camadas: Evidências, Ações,
  Frontstage, Bastidores, Sistemas + gargalos/oportunidades/indicadores). **POLEM cria** (aba em
  `/curadoria`); **Direção consulta** (`/blueprints`). Dados e componentes em `frontend/src/blueprints.tsx`.
- **Gestão de Riscos (Compras)** — aba que reproduz, no design nórdico, a lógica de uma suíte de
  indicadores de *sourcing* (referência ILOS/Bio-Manguinhos), com painel do **PCA 2026**. Página em
  `frontend/src/pages/GestaoRiscos.tsx`. Números hoje são **fixos no componente** (extraídos do CSV do PCA).
- **Conecta (`/conecta`, `Conecta.tsx`)** — publicação institucional da Vice-Direção, em duas
  seções no topo: **Informativo** (alerta de segurança + avisos dos setores, cada um abrindo sua
  "matéria"; hero com a "trama" de nós no estilo nórdico) e **Quem é quem** (os setores reais,
  **data-driven** de `/api/setores`). Espaço **editorial humano** (SECOM) — separado da Duca. Os
  avisos/alerta são **mock** ("na agulha") — depois viram publicação real mantida pelo SECOM.
- **Duca (`components/Chatbot.tsx`)** — assistente/guia da plataforma (FAB no canto). Robô nórdico,
  saudação por horário, atalhos para as partes subutilizadas, `responder()` por regras (mock). Não
  autora comunicados institucionais (isso é papel humano/SECOM).
- **Manuais do usuário** — dois manuais em abas dentro da plataforma, **100% concluídos** (texto +
  prints reais + mapa): **Manual do Setor** (`manual/ManualSetor.tsx`, perfil funcionário) e
  **Manual da Direção** (`manual/ManualDirecao.tsx`, perfil estratégico). Casca compartilhada em
  `manual/kit.tsx` (Hotword, Print com lightbox, LogoInst, ManualShell + Exportar PDF).
- **Gravação → Ata / "do áudio ao documento"** — fluxo transversal: gravar/importar áudio →
  transcrever → **validação humana** → gerar documento (ata/relatório/mapeamento). Backend real
  pronto ("na agulha", modo simulado por padrão). Componente visual `components/FluxoAudioDoc.tsx`.
- **Mapeamento · Qualidade (SGQ)** — gerar POP a partir de entrevistas; exemplos BPMN, diagnóstico
  de 222 processos, `POPDocument`.
- **Bússola do Saber (`/bussola`)** — glossário/busca em linguagem simples de termos técnicos.
- **Banco de Prompts (`/prompts`)** — biblioteca de prompts.
- **Terceirizados (`/terceirizados`)** — diagnóstico (dados em `backend/app/data/terceirizados_ensp.json`).
- **Recuperar senha (`/recuperar-senha`)** — fluxo código de verificação → nova senha (o **envio do
  código por e-mail está stubado** até configurar SMTP; a lógica já é a "de produção").

## 9. Mapa de arquivos-chave

**Backend (`backend/app/`):**
- `main.py` — app FastAPI, CORS, startup (init_db + seed). Inclui os routers.
- `seed.py` — os 13 setores, usuários de teste, metas/demandas, glossário da Bússola.
- `models.py` — `Setor`, `User`, `Meta`, `Demanda`, `RecursoLOAS`, `RegistroTranscricao`.
- `auth.py` — JWT, hash de senha, RBAC. · `dlp.py` — detecção de dados sensíveis.
- `ai/agent.py` — IA mock: `responder()` (Duca) + `gerar_documento(tipo, transcricao, meta)`.
- `transcricao.py` — motor simulado/real (faster-whisper). · `routers/` — auth, setores,
  dashboard, setor, chat, bussola, terceirizados, transcricao.

**Frontend (`frontend/src/`):**
- `App.tsx` — rotas + guarda `Protegido` (RBAC). · `pages/` — as telas.
- `pages/CuradoriaIAs.tsx` — **o workspace em abas** (arquivo central, grande).
- `blueprints.tsx` — dados + componentes dos 13 blueprints.
- `manual/` — `ManualSetor.tsx`, `ManualDirecao.tsx`, `kit.tsx` (casca compartilhada).
- `components/` — `Chatbot.tsx` (Duca), `RobotIcon.tsx`, `FluxoAudioDoc.tsx`, `TopNav.tsx`,
  `icons.tsx`, gráficos (`*Chart.tsx`), `KpiCard.tsx`, `NovaMetaForm.tsx`, `BoasVindas.tsx`.
- `index.css` — **todo o estilo** (paleta nórdica; classes `.bp-*`, `.gr-*`, `.rec-*`, `.ata-*`,
  `.manual-*`, `.conecta-*`, `.chat-*`, `.fluxo-doc`, `.mapa-*`). · `utils/dlp.ts`, `utils/formato.ts`.

**Assets servidos:** `frontend/public/manual/` (prints reais + logos do manual),
`frontend/public/demo/` (logos Fiocruz/ENSP da Gestão de Riscos), `frontend/public/adauto-logo.jpg`.

## 10. Endpoints principais (API)

- **Auth:** `POST /api/login` · `GET /api/me` · `GET /api/setores`
- **Dashboard (estratégico):** `GET /api/dashboard/{kpis, metas-por-setor, recursos, demandas-timeline, metas-em-risco}` (aceitam `?setor_id=`)
- **Espaço Setorial:** `GET /api/setor/metricas` · `GET|POST /api/setor/metas` · `DELETE /api/setor/metas/{id}`
- **Assistente (Duca):** `POST /api/chat` — `{ mensagem, contexto? }`
- **Bússola:** `GET /api/bussola…` · **Terceirizados:** `GET /api/terceirizados…`
- **Transcrição:** `POST /api/transcricao/arquivo` (transcreve e **apaga o áudio** na hora) ·
  `POST /api/transcricao/documento` · `POST /api/transcricao/registros` · `GET /api/transcricao/registros?q=`

## 11. Convenções importantes

- **Nascer no formato certo (rumo à produção):** implemente com a estrutura que serviria em
  produção, deixando **stubs claros** onde falta infra (ex.: envio de e-mail, IA real). Cada etapa
  vira **commit**; decisões ficam documentadas (antes na memória, agora em [`docs/`](docs/)).
- **"Na agulha":** o que é mock (IA, transcrição) tem a **mesma assinatura** da versão real, para
  trocar o motor **sem retrabalho**. Ligar a IA real: SDK `anthropic` + chave do Anthropic Console.
  Ligar transcrição real: `pip install -r backend/requirements-transcricao.txt` + `MODO_TRANSCRICAO=real`.
  ⚠️ O plano **Claude Pro não inclui API** — a Claude API é cobrada por uso, à parte.
- **Validação humana sempre:** nenhuma saída de IA vira registro oficial sem revisão humana.
- **Manual acompanha a plataforma:** **toda mudança na plataforma implica atualizar o Manual.** O
  dono do produto tira o **print real** da tela nova/alterada e salva numa pasta; o assistente
  **copia** para `frontend/public/manual/` com o nome certo (o componente `Print`/`LogoInst` puxa por
  nome de arquivo). Substituir o PNG de mesmo nome atualiza a figura sem mexer no código.
- **Fluxo de imagens:** colar imagem no chat **não** grava em disco. O dono salva prints/logos numa
  pasta da Área de Trabalho (`IA_ENSP/Plataforma _Adauto/…`) e o assistente copia para o `public/`
  com o nome final. Prints reais são **mais baratos em tokens** que mockups.
- **Fronteira de papéis:** a **Duca** (assistente/guia) **não** se mistura com áreas de
  responsabilidade humana — em especial **Comunicação** (SECOM), que é editorial e tem dono humano
  que assina o que publica.

## 12. Pegadinhas conhecidas (gotchas)

- **OneDrive quebra o `--reload`** do uvicorn (watcher). Reinicie o backend manualmente se preciso.
- **Vite em IPv6 (`[::1]`)** — use `localhost`, não `127.0.0.1`, ao testar via curl.
- **`ColaboraAI.tsx` (`/colabora`) é órfã** — não desenvolva lá; integre no `CuradoriaIAs.tsx`.
- **Transcrição ao vivo por pedaços:** `MediaRecorder` só põe cabeçalho no 1º chunk; os seguintes
  não abrem sozinhos. Por isso o "ao vivo" fica **simulado** no front; VAD/overlap fica na agulha.
- **`backend/vddig.db` está versionado** no git (aparece como modificado com frequência). É o banco
  SQLite com o seed. Cuidado ao commitar mudanças não intencionais dele.

## 13. Pendências e próximos passos

- **Gestão de Riscos:** faltam bases de dados (Saving, Etapas/SEI, Fornecedores, Kraljic) e,
  idealmente, importar o CSV do PCA no backend + formulário de cadastro (hoje os números são fixos).
- **Conecta:** deep links por seção (O que fazemos / Avisos / Equipe) por setor — precisam do
  slug/URL oficial de cada serviço no site vddig.ensp.fiocruz.br (adicionar `site_url` no `Setor`).
- **Segurança para produção:** reset de senha por e-mail real (SMTP), não expor se um e-mail existe;
  auditoria/log imutável de minutas de IA e de alertas DLP; ver [`docs/riscos-e-proximas-definicoes.md`](docs/riscos-e-proximas-definicoes.md).
- **IA real:** trocar o mock por Claude API (RAG setorial por normativas, com validação humana).
- **Transcrição:** ligar o áudio real também na aba **Mapeamento·Qualidade** (POP) do SGQ.

## 14. Glossário rápido

- **VDDIG** — Vice-Direção de Desenvolvimento Institucional e Gestão (ENSP/Fiocruz).
- **ENSP** — Escola Nacional de Saúde Pública Sergio Arouca. **Fiocruz** — Fundação Oswaldo Cruz.
- **LOAS** — foco de gestão de verbas assistenciais. **PCA** — Plano de Contratações Anual.
- **LGPD/DLP** — proteção de dados + prevenção de vazamento (camada de conscientização).
- **RAG** — busca aumentada por documentos. **RBAC** — controle de acesso por papel.
- **POP** — Procedimento Operacional Padrão. **SECOM** — comunicação institucional (dono humano).
- **"Na agulha"** — pronto para trocar o motor mock pelo real sem retrabalho.

## 15. Onde está o resto da documentação

- [`docs/como-trabalhamos.md`](docs/como-trabalhamos.md) — o jeito de trabalhar do dono do produto (detalhado).
- [`docs/decisoes-e-funcionalidades.md`](docs/decisoes-e-funcionalidades.md) — histórico das decisões por funcionalidade (Blueprints, Gestão de Riscos, Duca, Conecta, Transcrição, Manuais).
- [`docs/bussola-do-saber.md`](docs/bussola-do-saber.md) — especificação da Bússola do Saber.
- [`docs/riscos-e-proximas-definicoes.md`](docs/riscos-e-proximas-definicoes.md) — checklist de riscos/definições para produção.
- [`README.md`](README.md) — visão técnica original (arquitetura, como rodar, endpoints).
