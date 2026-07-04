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

    if p.strip() == "" or any(t in p for t in ("oi", "olá", "ola", "ajuda", "dúvida", "duvida", "como usar")):
        return (
            "Olá! Sou o assistente do Espaço Setorial. Posso ajudar a cadastrar metas, "
            "entender os status e as métricas, e orientar sobre proteção de dados (LGPD). "
            "Sobre o que você tem dúvida?"
        )

    return (
        "Ainda estou aprendendo sobre esse tema. Posso ajudar com: cadastro de metas, "
        "significado dos status e métricas, e proteção de dados (LGPD). Pode reformular a pergunta?"
    )
