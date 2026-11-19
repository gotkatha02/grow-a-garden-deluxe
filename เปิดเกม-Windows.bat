@echo off
cd /d "%~dp0"
echo Totem Legend: http://localhost:8000
start "" http://localhost:8000/index.html
python -m http.server 8000 || py -m http.server 8000
pause
