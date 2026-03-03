@echo off
echo ========================================
echo  VeritasAI Community Server Setup
echo ========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python found
python --version
echo.

:: Navigate to backend directory
cd /d "%~dp0backend"

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Starting VeritasAI Backend Server
echo ========================================
echo.
echo Server will start at:
echo   API: http://localhost:8000
echo   Docs: http://localhost:8000/docs
echo   Health: http://localhost:8000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

:: Start the server
python main.py

pause
