@echo off
echo ========================================
echo Blood Donation Tracker - Frontend Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!
echo.

echo Step 2: Starting frontend...
echo ✅ Frontend will start on http://localhost:3000
echo ✅ Backend should be running on http://localhost:5001
echo ✅ Press Ctrl+C to stop the server
echo.
call npm start

pause
