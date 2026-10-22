# ==============================================================================
# AawazSetu (आवाज़ सेतु) - One-Click Launcher for VS Code & Windows
# Runs backend REST API Server + Opens Web Application in Default Browser
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🎙️ Starting AawazSetu (आवाज़ सेतु) Multilingual Backend Server" -ForegroundColor Yellow
Write-Host "🇮🇳 Languages: English | Hindi | Bhojpuri | Marathi | Tamil" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$port = 8080
$url = "http://localhost:$port"

# Start backend server
$scriptPath = Join-Path $PSScriptRoot "backend\server.ps1"
if (-not (Test-Path $scriptPath)) {
    $scriptPath = Join-Path $PSScriptRoot "server.ps1"
}

# Open browser in 1.5 seconds
Start-Job -ScriptBlock {
    param($u)
    Start-Sleep -Milliseconds 1500
    Start-Process $u
} -ArgumentList $url | Out-Null

& powershell.exe -ExecutionPolicy Bypass -File $scriptPath -Port $port -Root $PSScriptRoot
