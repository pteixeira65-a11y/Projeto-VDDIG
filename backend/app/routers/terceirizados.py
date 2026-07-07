"""Módulo Terceirizados — diagnóstico consolidado da ENSP (acesso da Direção).

Os dados vêm agregados por setor (sem dados pessoais) a partir da "Relação de
Terceirizados por Contrato" da DIRH/Fiocruz, filtrando apenas a ENSP.
"""
import json
from pathlib import Path

from fastapi import APIRouter, Depends

from ..auth import require_estrategico

router = APIRouter(
    prefix="/api/terceirizados",
    tags=["terceirizados"],
    dependencies=[Depends(require_estrategico)],  # somente Visão Estratégica / Direção
)

_ARQUIVO = Path(__file__).resolve().parent.parent / "data" / "terceirizados_ensp.json"
with open(_ARQUIVO, encoding="utf-8") as _f:
    _DIAGNOSTICO = json.load(_f)


@router.get("/diagnostico")
def diagnostico():
    """Diagnóstico consolidado dos terceirizados da ENSP, por setor."""
    return _DIAGNOSTICO
