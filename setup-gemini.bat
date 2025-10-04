@echo off
echo Setting up Gemini API for Blood Donation Tracker
echo.

echo Please follow these steps to get your Gemini API key:
echo 1. Go to https://aistudio.google.com/app/apikey
echo 2. Click "Create API Key"
echo 3. Copy the generated API key
echo.

set /p GEMINI_KEY="Enter your Gemini API key: "

if "%GEMINI_KEY%"=="" (
    echo Error: No API key provided
    pause
    exit /b 1
)

echo.
echo Creating .env file with Gemini configuration...

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
echo Next steps:
echo 1. Start MongoDB if not already running
echo 2. Run: cd backend && npm install
echo 3. Run: npm start
echo 4. In another terminal, run: cd frontend && npm start
echo.
echo The chatbot will now work with Gemini AI!
echo.
pause
