"""Adaptador dos Agentes de IA.

Implementação MOCK (simulada) nesta fase — não faz chamadas externas nem tem custo.
Mantém a mesma assinatura da versão real, para que a troca por Claude API seja trivial.

Para plugar a Claude real depois (requer chave no Anthropic Console — o plano Pro
NÃO inclui API):

    from anthropic import Anthropic
    client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    msg = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text
"""
from __future__ import annotations


def gerar_resumo_gestor(kpis: dict) -> str:
    """Gera um parágrafo-resumo dos KPIs para a gestão (versão simulada)."""
    pct_metas = kpis.get("pct_metas_concluidas", 0)
    pct_rec = kpis.get("pct_recursos_aplicados", 0)
    risco = kpis.get("metas_em_risco", 0)
    demandas_abertas = kpis.get("demandas_abertas", 0)

    partes = [
        f"{pct_metas:.0f}% das metas institucionais estão concluídas",
        f"{pct_rec:.0f}% dos recursos LOAS previstos já foram aplicados",
    ]
    if risco:
        partes.append(f"{risco} meta(s) exigem atenção por risco de atraso")
    partes.append(f"{demandas_abertas} demanda(s) seguem em aberto")

    return "Panorama consolidado: " + "; ".join(partes) + "."


def responder(pergunta: str, contexto: str = "") -> str:
    """Assistente do Espaço Setorial (versão simulada, baseada em regras).

    Cobre ajuda de uso do sistema e orientação de proteção de dados (LGPD). A troca
    por Claude API (RAG por setor) mantém esta mesma assinatura.
    """
    p = (pergunta or "").lower()
    ctx = (contexto or "").lower()

    # Orientação de proteção de dados (LGPD) — também disparada pela camada DLP.
    if ctx == "dlp" or any(t in p for t in ("anonim", "lgpd", "dado sensível", "dado pessoal", "cpf", "sigilos")):
        return (
            "Para tratar dados sensíveis com segurança antes de salvar: "
            "1) remova CPF/CNPJ, e-mails, telefones e valores sigilosos que não sejam "
            "essenciais ao registro; 2) se precisar identificar alguém, use apenas as "
            "iniciais ou um código interno; 3) descreva o fato sem expor a pessoa. "
            "Assim você reduz o risco de exposição institucional (LGPD). Quer que eu "
            "revise um trecho específico?"
        )

    # Identidade da Duca (homenagem — sem se passar pela pessoa real).
    if any(t in p for t in ("quem é você", "quem e voce", "quem é voce", "quem e você",
                            "quem é a duca", "quem e a duca", "sobre a duca", "por que duca",
                            "porque duca", "quem e duca", "quem é duca")):
        return (
            "Sou a Duca, a assistente da Plataforma Adauto — batizada em homenagem a Maria do "
            "Carmo, a “Duca”, ex-diretora da ENSP. Levo o nome e o jeito acolhedor dela para "
            "te ajudar no dia a dia. Sou uma assistente de IA, então a decisão é sempre humana. 🙂"
        )

    # Colabora AI
    if "colabora" in p:
        return (
            "No Colabora AI você reúne o conhecimento do setor: envie documentos e peça um resumo, "
            "uma minuta ou a organização por área. Também dá para gravar uma reunião e gerar a ata, "
            "e depois consultar tudo no Repositório. Quer ajuda com resumo, minuta ou transcrição?"
        )

    # Bússola do Saber
    if any(t in p for t in ("bússola", "bussola", "glossário", "glossario", "o que significa",
                            "significado")):
        return (
            "A Bússola do Saber é o glossário da plataforma: você busca um termo ou sigla e recebe "
            "a explicação em linguagem simples, com exemplo. Ótima para destravar aquele jargão. "
            "Qual termo você quer entender?"
        )

    # Banco de Prompts
    if "prompt" in p:
        return (
            "O Banco de Prompts traz modelos prontos de pedidos para a IA — é só buscar pelo tema, "
            "copiar com um clique e colar na ferramenta que você usa. Bom para redigir ofícios, "
            "resumir normas e padronizar textos. Quer um modelo para alguma tarefa?"
        )

    # Manual
    if "manual" in p:
        return (
            "O Manual fica na aba Manual, no alto do seu espaço. Ele explica, passo a passo e em "
            "linguagem simples, cada parte da plataforma — inclusive a Gravação → Ata. Dá para ler "
            "na tela ou exportar em PDF. Quer que eu explique alguma tela específica?"
        )

    # Gravação → Ata / transcrição
    if any(t in p for t in ("gravar", "gravação", "gravacao", "transcri", "áudio", "audio",
                            "entrevista", "reunião", "reuniao")) or ("ata" in p and "data" not in p):
        return (
            "Na aba Gravação → Ata você grava a reunião ao vivo ou envia o áudio de uma entrevista. "
            "A IA transcreve, você revisa o texto (validação humana) e a plataforma gera a ata no "
            "modelo da VDDIG. O áudio é descartado após a transcrição — só o texto fica guardado."
        )

    if "meta" in p and any(t in p for t in ("criar", "cadastr", "inserir", "adicion", "nova", "registr")):
        return (
            "Para cadastrar uma meta: preencha o título e uma descrição objetiva, escolha "
            "o status (não iniciada, em andamento, concluída ou atrasada), informe o "
            "progresso (0–100%) e o prazo. Ao salvar, ela entra na hora nas métricas do setor."
        )

    if "status" in p:
        return (
            "Os status são: Não iniciada, Em andamento, Concluída e Atrasada. Uma meta é "
            "marcada como “em risco” quando está atrasada ou com o prazo vencido sem estar concluída."
        )

    if "risco" in p:
        return (
            "Uma meta entra em “metas em risco” quando o status é Atrasada, ou quando o prazo "
            "já passou e ela ainda não foi concluída."
        )

    if "progresso" in p:
        return "O progresso vai de 0 a 100% e indica quanto da meta já foi realizado."

    if any(t in p for t in ("recurso", "loas", "verba", "orçament", "orcament")):
        return (
            "Os indicadores de recursos LOAS comparam o valor previsto com o valor já "
            "aplicado no setor e mostram o percentual de execução."
        )

    if p.strip() == "" or any(t in p for t in ("oi", "olá", "ola", "ajuda", "dúvida", "duvida",
                                               "como usar", "o que você faz", "o que voce faz")):
        return (
            "Oi! Eu sou a Duca, a assistente da Plataforma Adauto. Posso te guiar pelo Colabora AI, "
            "pela Bússola do Saber, pelo Banco de Prompts e pelo Manual, ajudar com metas e "
            "métricas, e orientar sobre proteção de dados (LGPD). Sobre o que você tem dúvida?"
        )

    return (
        "Ainda estou aprendendo sobre esse tema. Posso ajudar com: Colabora AI, Bússola do Saber, "
        "Banco de Prompts, Manual, cadastro de metas e métricas, e proteção de dados (LGPD). "
        "Pode reformular a pergunta?"
    )


# --------------------------------------------------------------------------- #
# Geração de documentos a partir de uma transcrição VALIDADA por um humano.    #
# Versão simulada (templates) — a troca por Claude API mantém esta assinatura. #
# --------------------------------------------------------------------------- #
from datetime import datetime  # noqa: E402


def _frases(texto: str) -> list[str]:
    """Quebra o texto em frases (heurística simples) para montar os tópicos."""
    bruto = (texto or "").replace("\n", " ")
    partes = []
    atual = ""
    for ch in bruto:
        atual += ch
        if ch in ".!?" and len(atual.strip()) > 25:
            partes.append(atual.strip())
            atual = ""
    if atual.strip():
        partes.append(atual.strip())
    return partes


_NOTA_VALIDACAO = (
    "\n\n---\n_Documento gerado por IA a partir da transcrição e sujeito a "
    "validação humana antes de virar registro oficial._"
)


def gerar_documento(tipo: str, transcricao: str, meta: dict | None = None) -> str:
    """Gera um documento padronizado a partir da transcrição (versão simulada).

    tipo: 'resumo' | 'ata' | 'relatorio' | 'mapeamento_processo'.

    Para plugar a Claude real depois, esta função vira uma chamada
    client.messages.create(...) com um prompt por tipo — a assinatura e o
    retorno (str) continuam iguais, então rotas e frontend não mudam.
    """
    meta = meta or {}
    hoje = datetime.now().strftime("%d/%m/%Y")
    frases = _frases(transcricao)
    topicos = frases[:5] if frases else ["(transcrição vazia)"]

    if tipo == "resumo":
        corpo = " ".join(frases[:3]) if frases else "(sem conteúdo)"
        pontos = "\n".join(f"- {f}" for f in topicos[:3])
        return (
            f"RESUMO EXECUTIVO — {hoje}\n\n{corpo}\n\n"
            f"Pontos principais:\n{pontos}" + _NOTA_VALIDACAO
        )

    if tipo == "ata":
        # Corpo apenas — o timbre (FIOCRUZ/ENSP), título e a grade de metadados
        # são renderizados pela folha .ata-doc no frontend, para não duplicar.
        deliberacoes = "\n".join(f"- {f}" for f in topicos)
        return (
            "Participantes: conforme lista de presença.\n\n"
            "Deliberações e registros:\n"
            f"{deliberacoes}\n\n"
            "Próximos passos: a minuta segue para validação humana antes da publicação."
            + _NOTA_VALIDACAO
        )

    if tipo == "relatorio":
        desenvolvimento = " ".join(frases) if frases else "(sem conteúdo)"
        return (
            f"RELATÓRIO — {hoje}\n\n"
            "1. Objetivo\n"
            "Registrar e organizar o conteúdo tratado na gravação.\n\n"
            "2. Desenvolvimento\n"
            f"{desenvolvimento}\n\n"
            "3. Conclusão\n"
            "Conteúdo consolidado; recomenda-se revisão pela área responsável."
            + _NOTA_VALIDACAO
        )

    if tipo == "mapeamento_processo":
        etapas = "\n".join(f"{i}. {f}" for i, f in enumerate(topicos, 1))
        return (
            f"MAPEAMENTO DE PROCESSO — {hoje}\n"
            f"Setor: {meta.get('setor', 'Gestão da Qualidade')}\n\n"
            "Nome do processo: (a confirmar na validação)\n\n"
            "Objetivo do processo:\n"
            "Descrever o fluxo conforme relatado, para padronização e melhoria.\n\n"
            "Etapas identificadas:\n"
            f"{etapas}\n\n"
            "Entradas: documentos/solicitações que iniciam o processo.\n"
            "Saídas: resultado entregue ao final do fluxo.\n"
            "Responsáveis: a confirmar com a área na validação.\n\n"
            "Pontos de atenção / oportunidades de melhoria:\n"
            "- Revisar gargalos relatados e etapas manuais dependentes de uma só pessoa.\n\n"
            "Indicadores sugeridos: tempo médio por etapa; retrabalho por documentação incompleta."
            + _NOTA_VALIDACAO
        )

    return "Tipo de documento não reconhecido." + _NOTA_VALIDACAO
