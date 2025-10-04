@echo off
echo ========================================
echo Blood Donation Tracker - Backend Setup
echo ========================================
echo.

echo Step 1: Checking if .env file exists...
if not exist ".env" (
    echo ❌ .env file not found! Creating one...
    echo MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker > .env
    echo JWT_SECRET=blood-donation-tracker-secret-key-2024 >> .env
    echo PORT=5001 >> .env
    echo ✅ .env file created successfully!
) else (
    echo ✅ .env file found
)
echo.

echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!
echo.

echo Step 3: Testing MongoDB connection...
call node ../test-mongodb.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ MongoDB connection failed!
    echo Please ensure MongoDB is running before starting the backend
    echo.
    pause
    exit /b 1
)
echo.

echo Step 4: Starting backend server...
echo ✅ Backend will start on http://localhost:5001
echo ✅ Press Ctrl+C to stop the server
echo.
call npm run dev

pause
