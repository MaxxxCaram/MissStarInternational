@echo off
cd /d %~dp0
"C:\Program Files\Git\bin\bash.exe" -c "node update-spanish-home.js"
echo Spanish home page update completed! Press any key to exit...
pause 