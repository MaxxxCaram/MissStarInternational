$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath
$scriptToRun = $args[0]
Write-Host "Ejecutando $scriptToRun usando Git Bash..."
& "C:\Program Files\Git\bin\bash.exe" -c "cd `"$scriptPath`" && node $scriptToRun" 