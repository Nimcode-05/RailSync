# Run RailSync FastAPI Backend Server
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting RailSync Backend (FastAPI + ML Intelligence Layer)" -ForegroundColor Cyan
Write-Host " SIH 2026 Problem Statement ID: 26028" -ForegroundColor DarkCyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\backend"
& "$PSScriptRoot\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
