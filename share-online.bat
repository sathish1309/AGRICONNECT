@echo off
TITLE AgriConnect Shareable Online Link
echo ========================================================
echo   AGRICONNECT: PUBLIC SHAREABLE LINK LAUNCHER
echo   B.Tech IT - Entrepreneurship and Startups Project
echo ========================================================
echo.
echo Ensuring local unified server (Port 5000) is running...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% neq 0 (
  echo Launching backend server on port 5000...
  start "AgriConnect Server" cmd /k "cd /d %~dp0server && node server.js"
  timeout /t 4 /nobreak >nul
)

echo.
echo Connecting to public tunnel...
echo Copy and share the HTTPS link generated below with your evaluators/friends!
echo (Keep this window open to keep the link online)
echo ========================================================
echo.
ssh -R 80:localhost:5000 -o ServerAliveInterval=15 -o ServerAliveCountMax=20 -o StrictHostKeyChecking=no nokey@localhost.run
pause
