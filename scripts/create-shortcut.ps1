# Script para crear un acceso directo en el escritorio
# Creado para Miss Star International

# Obtener la ruta del escritorio
$desktopPath = [Environment]::GetFolderPath("Desktop")

# Ruta del script auto-deploy.bat
$scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "auto-deploy.bat"
$scriptPath = (Resolve-Path $scriptPath).Path

# Crear el objeto WScript.Shell
$WshShell = New-Object -ComObject WScript.Shell

# Crear el acceso directo
$shortcutPath = Join-Path -Path $desktopPath -ChildPath "Miss Star - Despliegue FTP.lnk"
$shortcut = $WshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $scriptPath
$shortcut.IconLocation = "%SystemRoot%\System32\SHELL32.dll,13"
$shortcut.Description = "Despliegue automático al servidor FTP de Miss Star International"
$shortcut.WorkingDirectory = Split-Path -Path $scriptPath -Parent
$shortcut.Save()

Write-Host "✅ Acceso directo creado en el escritorio: 'Miss Star - Despliegue FTP'" 