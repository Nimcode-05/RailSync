# Run RailSync React + Vite Frontend
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Starting RailSync Frontend (React + Vite + Tailwind CSS)" -ForegroundColor Green
Write-Host " SIH 2026 Problem Statement ID: 26028" -ForegroundColor DarkGreen
Write-Host "==========================================================" -ForegroundColor Green

$nodeDir = "C:\Users\NIMISHA S\AppData\Roaming\fnm\node-versions\v24.21.0\installation"
$env:PATH = "$nodeDir;$env:PATH"

Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
