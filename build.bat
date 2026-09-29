@echo off
TITLE AgriConnect Build
echo ========================================================
echo   BUILDING AGRICONNECT FULL-STACK PROJECT
echo   B.Tech IT - Entrepreneurship and Startups Project
echo ========================================================
echo.
echo [1/3] Checking Node.js and npm environment...
node -v || (echo Node.js is required but not found in PATH! && pause && exit /b 1)
npm -v || (echo npm is required but not found in PATH! && pause && exit /b 1)

echo.
echo [2/3] Verifying server dependencies and database...
cd /d "%~dp0server"
call npm install --no-audit --prefer-offline

echo.
echo [3/3] Building client production distribution bundle...
cd /d "%~dp0client"
call npm install --no-audit --prefer-offline
call npm run build

echo.
echo ========================================================
echo   BUILD COMPLETED SUCCESSFULLY!
echo   Production bundle ready in: client\dist
echo   - To run development mode: run start-dev.bat
echo   - To run production server: cd server && npm start
echo ========================================================
pause
