@echo off
cd /d %~dp0
"C:\Program Files\Git\bin\bash.exe" -c "node deploy-conference.js"
echo Deployment completed! Press any key to exit...
pause 