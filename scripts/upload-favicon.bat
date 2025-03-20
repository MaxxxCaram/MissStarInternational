@echo off
echo ===== CARGANDO FAVICON PARA MISS STAR INTERNATIONAL =====
echo.

cd %~dp0
node upload-favicon.js

echo.
echo ===== PROCESO FINALIZADO =====
pause 