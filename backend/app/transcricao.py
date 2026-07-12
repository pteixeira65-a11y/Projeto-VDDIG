"""Serviço de transcrição de áudio (transversal — todos os setores).

Nesta fase de DEMONSTRAÇÃO a transcrição é SIMULADA: roda na hora, sem baixar
modelos pesados e sem depender de GPU, garantindo que a apresentação à
coordenação nunca trave.

O código de transcrição REAL (faster-whisper, 100% local) já está escrito abaixo,
atrás de uma chave (a variável de ambiente MODO_TRANSCRICAO). Se a coordenação
aprovar, basta:

    1) pip install -r requirements-transcricao.txt   # baixa o faster-whisper
    2) definir a variável de ambiente  MODO_TRANSCRICAO=real

...e a transcrição passa a valer de verdade SEM mudar mais nada no resto do
sistema — mesma assinatura de função, mesmas rotas. Ou seja: zero retrabalho.

Privacidade (áudios de reuniões/entrevistas internas):
- o processamento é local; o áudio bruto nunca é enviado para fora;
- o arquivo temporário de áudio é apagado logo após a transcrição
  (ver routers/transcricao.py); apenas o TEXTO transcrito persiste.
"""
from __future__ import annotations

import os

# Chave simulado/real. Padrão "simulado" para a demonstração nunca travar.
MODO = os.environ.get("MODO_TRANSCRICAO", "simulado").lower()

# Modelo do Whisper para o modo real. "small" equilibra velocidade e qualidade
# em português rodando só em CPU; suba para "medium" se a máquina permitir.
MODELO = os.environ.get("WHISPER_MODELO", "small")


# --------------------------------------------------------------------------- #
# Amostra usada APENAS no modo simulado (demonstração).                        #
# Representa a fala espontânea de uma entrevista de mapeamento de processo —   #
# do jeito "picado" que uma transcrição real costuma sair, para que a etapa    #
# de validação humana faça sentido na tela.                                    #
# --------------------------------------------------------------------------- #
_AMOSTRA = (
    "Então, o processo começa quando o setor requisitante manda a solicitação "
    "pra gente, geralmente por e-mail ou pelo sistema interno. A primeira coisa "
    "que a gente faz é conferir se a documentação está completa, porque muita "
    "vez chega faltando o formulário assinado, aí trava tudo. Se estiver ok, a "
    "gente registra no protocolo e encaminha pra análise técnica. A análise "
    "técnica é feita pela equipe do setor, que avalia se atende aos requisitos, "
    "e isso leva uns três a cinco dias em média. Depois volta pra coordenação "
    "pra aprovação, e só então segue pro setor de compras ou pro arquivo, "
    "dependendo do caso. O maior gargalo hoje é essa conferência inicial, "
    "porque é manual e depende de uma pessoa só. Se ela falta, acumula."
)


def transcrever_arquivo(caminho: str) -> str:
    """Recebe o caminho de um arquivo de áudio e devolve o texto transcrito.

    Assinatura estável: vale tanto no modo simulado quanto no real.
    """
    if MODO == "real":
        return _transcrever_real(caminho)
    return _AMOSTRA


# --------------------------------------------------------------------------- #
# Transcrição REAL (na agulha) — só é exigida/importada quando MODO=real.      #
# --------------------------------------------------------------------------- #
_modelo_cache = None


def _carregar_modelo():
    """Carrega o modelo faster-whisper uma vez e reaproveita (cache em memória)."""
    global _modelo_cache
    if _modelo_cache is None:
        # Import tardio: o faster-whisper só é necessário no modo real, então a
        # demonstração roda sem a biblioteca instalada.
        from faster_whisper import WhisperModel

        # device="cpu" + compute_type="int8": roda bem sem GPU dedicada.
        _modelo_cache = WhisperModel(MODELO, device="cpu", compute_type="int8")
    return _modelo_cache


def _transcrever_real(caminho: str) -> str:
    """Transcrição real, 100% local, com faster-whisper.

    vad_filter=True usa detecção de silêncio para cortar em pausas naturais da
    fala — o que também ajuda no cenário de trechos ao vivo (evita frases
    cortadas no meio).
    """
    modelo = _carregar_modelo()
    segmentos, _info = modelo.transcribe(caminho, language="pt", vad_filter=True)
    return " ".join(s.text.strip() for s in segmentos).strip()
