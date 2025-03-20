@echo off
echo ==========================================================
echo   SOLUCION DE ERRORES CODEQL EN GITHUB
echo ==========================================================
echo.

cd %~dp0
node fix-codeql-errors.js

echo.
echo ==========================================================
echo   PROCESO FINALIZADO
echo ==========================================================
pause 