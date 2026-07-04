"""Camada de conscientização de dados (Data Loss Prevention — DLP / LGPD).

Detecta possíveis dados pessoais/sensíveis em textos livres. NÃO bloqueia: apenas
retorna "achados" com orientação, para que a interface dispare um alerta de
conscientização (art. 6º da LGPD — princípios de necessidade e segurança).
"""
import re

# (tipo, regex, orientação)
_PADROES = [
    (
        "CPF",
        re.compile(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b"),
        "Evite registrar CPF. Se precisar identificar alguém, use as iniciais ou um código interno.",
    ),
    (
        "CNPJ",
        re.compile(r"\b\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}\b"),
        "Só inclua o CNPJ completo se for essencial ao registro.",
    ),
    (
        "E-mail pessoal",
        re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b"),
        "E-mails são dados pessoais (LGPD). Prefira referenciar o canal ou o setor oficial.",
    ),
    (
        "Telefone",
        re.compile(r"\b\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}\b"),
        "Telefone é dado pessoal — não registre se não for necessário para a demanda.",
    ),
]

_PALAVRAS = {
    "sigiloso": "Conteúdo marcado como sigiloso: confirme se ele pode constar neste registro.",
    "confidencial": "Conteúdo confidencial: avalie o nível de acesso antes de salvar.",
    "senha": "Nunca registre senhas em texto livre — isso expõe a instituição.",
    "salário": "Dados de remuneração são sensíveis — anonimize sempre que possível.",
    "salario": "Dados de remuneração são sensíveis — anonimize sempre que possível.",
}


def analisar(texto: str) -> list[dict]:
    """Retorna lista de achados: [{'tipo': ..., 'orientacao': ...}]."""
    if not texto:
        return []
    achados: list[dict] = []
    vistos: set[str] = set()

    for tipo, regex, orientacao in _PADROES:
        if tipo not in vistos and regex.search(texto):
            achados.append({"tipo": tipo, "orientacao": orientacao})
            vistos.add(tipo)

    minusculo = texto.lower()
    for palavra, orientacao in _PALAVRAS.items():
        chave = f"palavra:{palavra}"
        if chave not in vistos and palavra in minusculo:
            achados.append({"tipo": f'Termo sensível: "{palavra}"', "orientacao": orientacao})
            vistos.add(chave)

    return achados
