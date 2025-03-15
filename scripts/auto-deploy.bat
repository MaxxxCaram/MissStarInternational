@echo off
echo ===================================================
echo    MISS STAR INTERNATIONAL - DESPLIEGUE AUTOMATICO
echo ===================================================
echo.

echo Iniciando proceso de despliegue...
echo.

:: Ejecutar el script de despliegue
node scripts/deploy-ftp.js

echo.
echo ===================================================
echo    PROCESO FINALIZADO
echo ===================================================

pause 