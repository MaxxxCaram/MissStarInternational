@echo off
echo ===================================================
echo    MISS STAR INTERNATIONAL - SUBIDA ESENCIAL
echo ===================================================
echo.

echo Iniciando subida de archivos esenciales...
echo.

:: Cambiar al directorio del script para evitar problemas de rutas relativas
cd /d "%~dp0"

:: Ejecutar el script de subida esencial
node upload-essential.js

echo.
echo ===================================================
echo    PROCESO FINALIZADO
echo ===================================================

pause 