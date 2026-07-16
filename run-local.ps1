# Sobe backend (FastAPI :8000) e frontend (Vite :5173) em janelas separadas.
# Uso:  powershell -ExecutionPolicy Bypass -File .\run-local.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# Recarrega o PATH do sistema em cada janela (garante que 'npm' seja encontrado
# mesmo logo apos instalar o Node, sem precisar reabrir o terminal).
$refreshPath = "`$env:Path=[Environment]::GetEnvironmentVariable('Path','Machine')+';'+[Environment]::GetEnvironmentVariable('Path','User');"

# Backend
Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "$refreshPath Set-Location '$root\backend'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
)

# Frontend
Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "$refreshPath Set-Location '$root\frontend'; npm run dev"
)

Write-Host ""
Write-Host "Backend:  http://localhost:8000  (docs: http://localhost:8000/docs)"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Login de teste: direcao@ensp.fiocruz.br / senha: fiocruz123"
