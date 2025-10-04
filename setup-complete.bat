@echo off
echo ========================================
echo Blood Donation Tracker - Gemini Setup
echo ========================================
echo.

echo This script will help you set up Gemini AI for the chatbot.
echo.

echo Step 1: Get your Gemini API Key
echo 1. Go to: https://aistudio.google.com/app/apikey
echo 2. Click "Create API Key"
echo 3. Copy the generated API key
echo.

set /p GEMINI_KEY="Enter your Gemini API key: "

if "%GEMINI_KEY%"=="" (
    echo.
    echo ❌ Error: No API key provided
    echo Please run this script again and enter a valid API key.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating .env file...

(
echo # Database
echo MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker
echo.
echo # JWT Secret
echo JWT_SECRET=your-super-secret-jwt-key-here
echo.
echo # Server
echo PORT=5001
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Google OAuth 2.0
echo GOOGLE_CLIENT_ID=your-google-client-id
echo GOOGLE_CLIENT_SECRET=your-google-client-secret
echo.
echo # AI Configuration
echo AI_PROVIDER=gemini
echo GEMINI_API_KEY=%GEMINI_KEY%
echo GEMINI_MODEL=gemini-pro
echo.
echo # OpenAI Configuration ^(alternative^)
echo OPENAI_API_KEY=your-openai-api-key-here
echo OPENAI_MODEL=gpt-3.5-turbo
) > backend\.env

echo.
echo ✅ .env file created successfully!
echo.
echo Step 3: Starting the application...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo ✅ Gemini AI is now configured
echo ✅ Schedule donation form will save to MongoDB
echo ✅ Chat will provide dynamic AI responses
echo.
echo The application should now be running:
echo - Backend: http://localhost:5001
echo - Frontend: http://localhost:3000
echo.
echo Test the features:
echo 1. Open chat and ask questions about blood donation
echo 2. Schedule a donation at any blood center
echo 3. Submit blood requests
echo.
pause
