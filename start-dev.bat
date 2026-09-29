@echo off
TITLE AgriConnect Launcher
echo ========================================================
echo   AGRICONNECT: DIGITAL FARMER-TO-BUYER MARKETPLACE
echo   B.Tech IT - Entrepreneurship and Startups Project
echo ========================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "AgriConnect Backend Server" cmd /k "cd /d %~dp0server && npm start"

timeout /t 3 /nobreak >nul

echo Starting React Frontend (Port 5173)...
start "AgriConnect React Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================================
echo   Servers launched!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api/health
echo ========================================================
pause
