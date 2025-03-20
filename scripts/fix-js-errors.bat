@echo off
echo ===== CORRIGIENDO ERRORES JAVASCRIPT EN MISS STAR INTERNATIONAL =====
echo.

cd %~dp0
node fix-js-errors.js

echo.
echo ===== PROCESO FINALIZADO =====
pause 