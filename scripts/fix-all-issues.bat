@echo off
echo ===== CORRECCIÓN COMPLETA DE ERRORES EN MISS STAR INTERNATIONAL =====
echo.

cd %~dp0
node fix-all-issues.js

echo.
echo ===== PROCESO FINALIZADO =====
pause 