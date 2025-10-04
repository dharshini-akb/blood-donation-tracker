@echo off
echo ========================================
echo Blood Donation Tracker - Status Check
echo ========================================
echo.

echo Checking if servers are running...
echo.

echo Backend Server (Port 5001):
curl -s http://localhost:5001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is running
) else (
    echo ❌ Backend server is not running
    echo    Please run: cd backend ^&^& npm start
)

echo.
echo Frontend Server (Port 3000):
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running
) else (
    echo ❌ Frontend server is not running
    echo    Please run: cd frontend ^&^& npm start
)

echo.
echo ========================================
echo Quick Start Commands:
echo ========================================
echo.
echo To start backend:
echo   cd backend
echo   npm start
echo.
echo To start frontend (in new terminal):
echo   cd frontend
echo   npm start
echo.
echo To start both at once:
echo   npm run dev
echo.
echo ========================================
echo Features to Test:
echo ========================================
echo.
echo 1. Open Chat - Ask questions about blood donation
echo 2. Schedule Donation - Click any blood center's "Schedule Donation"
echo 3. Blood Requests - Submit requests on Blood Availability page
echo 4. Voluntary Camps - Register a new camp
echo.
echo All data will be saved to MongoDB!
echo.
pause
