# Decisões e funcionalidades — histórico do projeto

> Registro das principais decisões por funcionalidade, preservado da memória do Claude Code (que
> não vai para o GitHub). Complementa o mapa de funcionalidades do [`AGENT.md`](../AGENT.md) (seção 8).
> As referências de arquivo/linha eram verdadeiras quando escritas — **confirme no código atual**.

## Blueprints dos 13 setores (commit `6279caa`)

Service Blueprints dos 13 setores da VDDIG, seguindo a metodologia: **etapas × camadas**
(Evidências, Ações, Frontstage, Bastidores, Sistemas) + gargalos, oportunidades, indicadores.
Status por blueprint: Validado / Em revisão / Em elaboração, com barra de evolução.

- Dados + componentes em `frontend/src/blueprints.tsx` (`BlueprintView`, `PainelSetores`,
  `BlueprintsExplorer` com modo `'polem' | 'direcao'`).
- **POLEM cria:** aba "Blueprints" em `/curadoria` (estúdio que lista os 13 e abre cada um).
- **Direção consulta:** página `/blueprints` (`pages/BlueprintsSetores.tsx`, só `estrategico`),
  vitrine de leitura. Item no `TopNav.tsx` (`IconBlueprint`).
- CSS do painel em `index.css` (`.bp-painel`, `.bp-setor-card`, `.bp-status`, `.bp-progress`).

## Gestão de Riscos (setor de Compras) (commits `a52717d`, `431960d`, `0b865b3`)

Aba **"Gestão de Riscos"** no setor de Compras que reproduz, no design nórdico da Adauto, a lógica
de uma suíte de "Indicadores de Sourcing" (referência: o que o **ILOS** montou para o
**Bio-Manguinhos** — o dono mostrou prints como "mockup para seduzir a coordenadora"). Substituição
de marca: Bio-Manguinhos → ENSP/VDDIG, ILOS → Gestão de Riscos.

- Página `frontend/src/pages/GestaoRiscos.tsx` — painel do **PCA 2026** (KPIs, valor por área,
  Bens×Serviços donut, situação, prioridade, tabela) + menu da visão completa
  (Processos/Etapas/Fornecedores/Kraljic/Mapa de Riscos, ainda sem dados). Estilos `.gr-*`.
- Ligado no `CuradoriaIAs.tsx` como aba condicional (`setorAtivo?.sigla === 'Compras'`).
- **Fonte de dados** (o PCA 2026): CSV em latin-1, delimitador `;`, ~2.718 itens / 285
  contratações / R$ 289,3 mi. Insight: por valor, Serviços ≈ 85%; VDDIG+DIR concentram ~80%.
  Hoje os números do painel estão **fixos no componente** (extraídos da análise do CSV).
- Página standalone para apresentar em tela cheia sem login: `frontend/public/gestao-riscos-demo.html`.
- **Esquema do input** (na agulha): Fonte (PCA hoje / SEI futuro) → Entrada (importar planilha /
  formulário) → Adauto organiza (limpa, valida, calcula) → Saída (painel + mapa de riscos).
- **Pendências:** bases faltantes (Saving, Etapas/SEI, Fornecedores, Kraljic); metodologia de risco
  base ISO 31000 / mapa de calor Prob×Impacto foi esboçada; importar o CSV de verdade + formulário.

## Assistente Duca (commit `02a87ad`)

O chatbot "Assistente" (`frontend/src/components/Chatbot.tsx`, FAB no canto, ligado a `/api/chat` →
`responder()`) virou a **Duca** (homenagem — ver `AGENT.md` seção 2).

- **Robô mantido** (`RobotIcon`, traço nórdico) — só ganhou nome. Botão/cabeçalho dizem "Duca".
- **Azul fjord** no cabeçalho do chat (`.chat-topo` usa `--azul` #4a6b82).
- **Saudação por horário** (`saudacaoInicial()`): Bom dia ☀️ / Boa tarde 🌤️ / Boa noite 🌙.
- **Atalhos** para partes subutilizadas: Colabora AI · Bússola · Banco de Prompts · Manual · LGPD.
- **`responder()` ampliado** (mock/regras em `agent.py`): ramos para Colabora AI, Bússola, Banco de
  Prompts, Manual, Gravação→Ata, identidade/homenagem + os antigos (LGPD, metas). Guarda para não
  confundir "ata" com "data".
- **Cuidado:** a Duca **não se passa** pela pessoa real — identifica-se como IA ("a decisão é sempre
  humana"). Vale OK institucional/da família.
- **Fronteira de papéis:** não misturar a Duca com áreas de responsabilidade humana, em especial
  **Comunicação** (SECOM), espaço editorial com dono humano que assina o que publica. A Duca não
  autora nem "anuncia" comunicados.

## Conecta VDDIG (commit `db38fd7`)

Porta de entrada institucional "quem é quem na gestão da VDDIG". Origem: esboço do dono
(`conecta-vddig.html`, estilo coral/glassmorphism/Apple) → **adaptado ao design nórdico** com
acento **terracota** (`--vermelho` / `#8f4d3b` / soft `#f2e2db`).

- Item "Conecta" no `TopNav` (`IconConecta`), rota `/conecta` (todos os papéis), página
  `frontend/src/pages/Conecta.tsx`. Estilos `.conecta-*`.
- **Data-driven:** puxa setores reais de `/api/setores` (sigla, nome, missão, objetivos,
  responsável). Cartão = sigla · nome · o que faz (missão) · a quem procurar (responsável) + link
  "Ver no site da VDDIG ↗".
- Dentro da plataforma, o Conecta **perde o masthead gigante** do esboço (para não competir com a
  marca Adauto) e vira seção nativa.
- **Ownership:** espaço **editorial humano** (SECOM/cada setor), separado da Duca.
- **Site oficial de referência** (vddig.ensp.fiocruz.br): cada serviço tem menu Competência ·
  Equipe · O que Fazemos · Leis e Normas · Documentos · Relatórios · Avisos · Links Úteis.
  ("Avisos" = comunicação por setor; "Equipe" = a quem procurar.)
- **Pendências:** deep links por seção (O que fazemos / Avisos / Equipe) — precisam do slug/URL
  oficial de cada setor (adicionar `site_url` no `Setor`). Hoje há só 1 link ao site raiz.

## Transcrição de áudio → documento (commits `4b55a5a`, `c8f0591`, `6f0c202`)

Ferramenta de gravação/transcrição **transversal** (entra em todos os setores); na **Qualidade**
tem função específica de apoiar o **mapeamento de processos**. **Sempre com validação humana** antes
de virar registro oficial. É uma **demonstração para a coordenação**: precisa rodar o fluxo inteiro
de forma confiável, com arquitetura **"na agulha"** (troca o motor simulado pelo real sem retrabalho).

**Backend (pronto, modo simulado por padrão):**
- `backend/app/transcricao.py` — chave `MODO_TRANSCRICAO=simulado|real`. Código real do
  `faster-whisper` (local, CPU, import tardio). `WHISPER_MODELO` padrão "small".
- `backend/app/routers/transcricao.py` — `POST /api/transcricao/arquivo` (transcreve e **apaga o
  áudio** na hora), `/documento`, `/registros`, `GET /registros?q=`.
- `backend/app/ai/agent.py` — `gerar_documento(tipo, transcricao, meta)` para
  **resumo | ata | relatorio | mapeamento_processo** (mock → Claude, mesma assinatura).
- `backend/app/models.py` — tabela `RegistroTranscricao` (repositório pesquisável; só texto, nunca áudio).
- **Ligar o real:** `pip install -r backend/requirements-transcricao.txt` + `MODO_TRANSCRICAO=real`
  (zero mudança de código).

**Frontend (integrar SEMPRE no `CuradoriaIAs.tsx`, não no `ColaboraAI` órfão):**
- Componente **`ReuniaoAta`** (aba "Gravação → Ata") = ferramenta transversal, com fluxo real
  (gravar ao vivo simulado / enviar áudio → `/arquivo` → validação humana editável → `/documento`
  tipo=ata → folha `.ata-doc` com timbre + salvar).
- **Fluxo "do áudio ao documento"**: componente SVG nórdico `frontend/src/components/FluxoAudioDoc.tsx`
  (Gravar / Importar → Transcrever → Validar → Gerar → Ata/Mapeamento/Relatório). Aparece como
  abertura da aba e como figura nos dois manuais.
- **Logos institucionais reais** no timbre dos documentos: `LogoDoc` usa `/manual/logo-fiocruz.png`
  e `/manual/logo-ensp.png`, com fallback tipográfico.
- Componente **`MapeamentoQualidade`** (aba "Mapeamento · Qualidade", só SGQ) → "Gerar POP a partir
  de entrevistas". Hoje importa áudios exemplo → `POPDocument` fixo. **Pendência:** ligar transcrição
  real + `mapeamento_processo` + validação humana (mantendo os recursos ricos: exemplos BPMN
  `FluxoBPMN`, diagnóstico real de 222 processos, `POPDocument`).

**Pegadinha:** transcrição ao vivo por pedaços — o `MediaRecorder` só põe cabeçalho no 1º chunk; os
seguintes não abrem sozinhos. Por ora o "ao vivo" fica simulado no front; VAD/overlap na agulha.

## Manuais do usuário (vários commits, 100% concluídos)

Dois manuais em abas dentro da plataforma, com **hotwords** (palavras destacadas que abrem a
explicação ao clicar) e botão **Exportar PDF**. Linguagem simples e dialógica, passo a passo.

- **Casca compartilhada:** `frontend/src/manual/kit.tsx` — `Hotword`, `Print` (com lightbox),
  `LogoInst`, `ManualShell` (barra Exportar PDF + capa + sumário).
- **Manual do Setor** (`manual/ManualSetor.tsx`, perfil funcionário) — **100% concluído**: 12 seções
  (Apresentação, Primeiro acesso, Esqueci senha, Colabora AI, Dashboard, Gravação→Ata, Repositório,
  Ferramentas de IA, Banco de Prompts, Bússola, Espaço Setorial, Blueprints[POLEM],
  Mapeamento·Qualidade[SGQ]) + **mapa da plataforma** (diagrama lógico em HTML/CSS) + prints reais.
- **Manual da Direção** (`manual/ManualDirecao.tsx`, perfil estratégico) — **100% concluído**: 10
  seções (Apresentação, Mapa, Colabora AI, Panorama, Blueprints, Terceirizados, Gravação→Ata,
  Notebook da Direção, Ferramentas de IA, Para fechar) + 7 prints reais. Aba "Manual" ligada no
  perfil Direção em `CuradoriaIAs.tsx`.
- **Prints:** preferir **prints reais** tirados pelo dono (mais baratos que mockups). Ficam em
  `frontend/public/manual/`; o componente `Print` puxa por nome de arquivo. Ver a convenção em
  [`como-trabalhamos.md`](como-trabalhamos.md).

## Recurso "Esqueci minha senha" (commit `a54ecb7`)

Fluxo com **código de verificação** (e-mail → código → nova senha), senha com **hash**. Só a
*entrega do código por e-mail* está **stubada** até configurar SMTP — exemplo da diretriz "nascer no
formato certo".
