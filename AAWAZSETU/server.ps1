# AawazSetu Multi-Language Backend & Web Server
param(
    [int]$Port = 8080,
    [string]$Root = "d:\AAWAZSETU"
)

$backendScript = Join-Path $PSScriptRoot "backend\server.ps1"
if (Test-Path $backendScript) {
    & powershell.exe -ExecutionPolicy Bypass -File $backendScript -Port $Port -Root $Root
} else {
    Write-Host "Backend server script not found at $backendScript" -ForegroundColor Red
}
