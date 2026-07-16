# Como trabalhamos — Plataforma Adauto (VDDIG)

> Guia do **jeito de trabalhar** do dono do produto. Vale para qualquer assistente de IA (Claude)
> ou pessoa que continuar o projeto. Resumo no [`AGENT.md`](../AGENT.md) (seção 3).

## Quem é o dono do produto

- **Não é programador.** É o dono do produto e conhece profundamente o negócio (gestão pública,
  ENSP/Fiocruz, os 13 setores da VDDIG).
- Trata o projeto como **gratidão e legado** (ver os nomes Adauto/Duca no `AGENT.md`, seção 2) —
  por isso cuida de cada detalhe.
- É **consciente do custo** (tokens) e quer aprender a ser eficiente.

## Fluxo de trabalho preferido

1. **Modelo híbrido de consulta.** Em mudanças **médias/grandes ou arriscadas**, **alinhar antes
   de implementar**. Ajustes pequenos podem ir direto. Quando ele confia e diz "pode fazer",
   avançar rápido.
2. **Modo consulta (padrão quando ele está discutindo ideias).** Quando ele diz "quero consultar"
   ou está pensando em voz alta, **NÃO implementar**. Só conversar — dar opinião, opções, prós e
   contras — em linguagem simples. Implementar **apenas com o comando explícito** ("pode
   implementar", "pode fazer"). Durante a conversa, evitar abrir arquivos e rodar ferramentas sem
   necessidade — responder com o que já se sabe do projeto.
3. **Mostrar → validar → commitar.** Ao terminar algo, **mostrar funcionando na tela** (verificar
   no preview), ele valida, e **só então commitar**. Cada etapa concluída vira um commit.
4. **Explicações simples e diretas.** Sem termos técnicos. Quando usar um termo necessário,
   explicá-lo em uma linha.

## Ensinar a economizar (ele pediu explicitamente)

Ele quer aprender a ser eficiente e barato. Sempre que possível, incluir uma breve explicação do
"por que fiz assim" e apontar o caminho mais econômico. Ponto-chave: **o custo vem mais de quantas
vezes você lê arquivos/roda ferramentas do que do tamanho da conversa.**

Práticas que ele já validou:
- **Alinhar antes de implementar** — evita retrabalho e leitura desnecessária de código.
- **Juntar pedidos parecidos** e pedir "faça tudo e me dê a lista no fim" — menos ida e volta.
- **Deixar o assistente terminar/verificar antes de comentar** — evita reler contexto.
- **Salvar prints numa pasta** e o assistente **copiar+renomear** — colar imagem no chat é caro e
  não grava em disco.
- **Ser específico** na tela/arquivo já conhecido; **reaproveitar** o que já existe.

## Convenção do Manual e dos prints

**Toda mudança na plataforma implica atualizar o Manual.** Fluxo:
- O dono tira o **print real** da tela nova/alterada e salva numa pasta da Área de Trabalho
  (`IA_ENSP/Plataforma _Adauto/…`, às vezes em subpastas como `logo/`, `novos_prints/`).
- O assistente **copia** a imagem para `frontend/public/manual/` com o **nome final** (ex.:
  `gravacao-ata.png`). O componente `Print`/`LogoInst` de `frontend/src/manual/kit.tsx` puxa a
  imagem **por nome de arquivo**, com fallback se faltar.
- **Substituir o PNG de mesmo nome** atualiza a figura automaticamente (sem mexer no código), se o
  texto/legenda não mudou.
- Tela **nova**: adicionar `<Print arquivo="nome.png" legenda="…" />` + o texto da seção em
  `ManualSetor.tsx` (setor) ou `ManualDirecao.tsx` (direção).
- Quando o **comportamento** muda (não só o visual), atualizar também o **texto** dos passos.

**Por quê:** o Manual precisa refletir a plataforma real, com **prints reais** (não mockups) — que
também são mais baratos em tokens.

## Rumo à produção

A Plataforma Adauto ainda é protótipo/simulação, mas deve **virar uso real**. Diretrizes:
- **Arquivar tudo conforme avança:** cada etapa vira commit no GitHub; decisões ficam documentadas
  (antes na memória do Claude, agora nesta pasta `docs/`).
- **Nascer no formato certo:** usar a estrutura que serviria em produção, com **stubs claros** onde
  falta infra (ex.: o "Esqueci a senha" já é um fluxo com código de verificação e hash de senha; só
  a *entrega do código por e-mail* está stubada até configurar SMTP).
- **Segurança de verdade** (reset por e-mail real, não expor se um e-mail existe, auditoria) fica
  como próximo passo para produção — ver [`riscos-e-proximas-definicoes.md`](riscos-e-proximas-definicoes.md).
