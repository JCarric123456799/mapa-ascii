@echo off
cd /d "%~dp0"
python --version >nul 2>&1
if errorlevel 1 (
    echo Python no esta instalado. Descargalo de python.org o escribe en tu terminal "python"
    pause
    exit /b
)
start http://localhost:8000
python -m http.server 8000
pause
