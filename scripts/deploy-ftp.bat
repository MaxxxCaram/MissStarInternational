@echo off
echo =================================================
echo        DESPLIEGUE FTP - MISS STAR INTERNATIONAL
echo =================================================
echo.

rem Cambiar al directorio del script
cd /d "%~dp0"
cd ..

echo Ejecutando script de despliegue FTP...
echo.

node scripts/deploy-ftp.js

echo.
echo =================================================
echo Presiona cualquier tecla para salir...
pause > nul 