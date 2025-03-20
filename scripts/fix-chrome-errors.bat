@echo off
echo ===== CORRIGIENDO ERRORES CHROME RUNTIME EN MISS STAR INTERNATIONAL =====
echo.

cd %~dp0
node fix-chrome-errors.js

echo.
echo ===== PROCESO FINALIZADO =====
pause 