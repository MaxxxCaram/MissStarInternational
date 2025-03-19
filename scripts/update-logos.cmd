@echo off
cd /d %~dp0
"C:\Program Files\Git\bin\bash.exe" -c "node update-logos.js"
echo Update logos completed! Press any key to exit...
pause 