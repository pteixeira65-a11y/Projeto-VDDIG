"""Rotas de transcrição de áudio e geração de documentos.

Ferramenta transversal (todos os setores); na Gestão da Qualidade apoia o
mapeamento de processos. Toda saída passa por validação humana antes de virar
registro oficial.

DEMONSTRAÇÃO: a transcrição é simulada (ver app/transcricao.py); a estrutura
real (faster-whisper, local) já está na agulha. Privacidade: o áudio é gravado
em arquivo temporário só para ser transcrito e é APAGADO em seguida — apenas o
texto persiste.

Obs.: nesta fase as rotas ficam abertas (sem exigir login), acompanhando o
protótipo do Colabora AI. Proteger com Depends(get_current_user) fica na agulha.
"""
import os
import tempfile
from datetime import datetime

from fastapi import APIRouter, Depends, File, UploadFile
from sqlmodel import Session, select

from ..ai.agent import gerar_documento
from ..database import get_session
from ..models import RegistroTranscricao
from ..schemas import (
    DocumentoOut,
    GerarDocRequest,
    RegistroCreate,
    RegistroOut,
    TranscricaoOut,
)
from ..transcricao import MODO, transcrever_arquivo

router = APIRouter(prefix="/api/transcricao", tags=["transcricao"])


@router.post("/arquivo", response_model=TranscricaoOut)
async def transcrever_upload(arquivo: UploadFile = File(...)):
    """Recebe um áudio (mp3/wav/m4a/webm), transcreve e descarta o áudio."""
    sufixo = os.path.splitext(arquivo.filename or "")[1] or ".dat"
    fd, caminho = tempfile.mkstemp(suffix=sufixo)
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(await arquivo.read())
        texto = transcrever_arquivo(caminho)
    finally:
        # Descarte garantido do áudio bruto — não guardamos cópia de backup.
        try:
            os.remove(caminho)
        except OSError:
            pass
    return TranscricaoOut(texto=texto, modo=MODO)


@router.post("/documento", response_model=DocumentoOut)
def gerar_doc(req: GerarDocRequest):
    """Gera um documento padronizado a partir da transcrição validada."""
    doc = gerar_documento(req.tipo, req.transcricao, {"setor": req.setor or ""})
    return DocumentoOut(tipo=req.tipo, documento=doc)


@router.post("/registros", response_model=RegistroOut)
def salvar_registro(req: RegistroCreate, session: Session = Depends(get_session)):
    """Salva o registro (texto + documento) no repositório histórico."""
    reg = RegistroTranscricao(**req.model_dump(), criado_em=datetime.now())
    session.add(reg)
    session.commit()
    session.refresh(reg)
    return reg


@router.get("/registros", response_model=list[RegistroOut])
def listar_registros(q: str = "", session: Session = Depends(get_session)):
    """Lista o repositório; se q for informado, filtra por texto (busca simples)."""
    registros = session.exec(
        select(RegistroTranscricao).order_by(RegistroTranscricao.id.desc())
    ).all()
    if q:
        ql = q.lower()
        registros = [
            r
            for r in registros
            if ql in r.titulo.lower()
            or ql in r.transcricao.lower()
            or ql in r.documento.lower()
            or ql in r.setor.lower()
        ]
    return registros
