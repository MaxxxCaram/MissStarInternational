@echo off
echo ===================================================
echo    MISS STAR INTERNATIONAL - DESPLIEGUE AUTOMATIC
echo ===================================================
echo.

echo Iniciando proceso de despliegue...
echo.

:: Cambiar al directorio del script para evitar problemas de rutas relativas
cd /d "%~dp0"

:: Ejecutar el script de despliegue
node deploy-ftp.js

echo.
echo ===================================================
echo    PROCESO FINALIZADO
echo ===================================================

pause 