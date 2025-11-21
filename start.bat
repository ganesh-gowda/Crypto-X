@echo off
echo Starting CryptoX Application...
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting Backend and Frontend servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:5173
echo.
start cmd /k "cd /d %~dp0 && npm run server"
timeout /t 3 /nobreak >nul
start cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers are starting in separate windows...
echo Press any key to exit this window.
pause >nul
