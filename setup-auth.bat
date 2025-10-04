@echo off
echo Installing backend dependencies...
cd backend
npm install passport passport-google-oauth20 passport-jwt
echo Backend dependencies installed!

echo.
echo Installing frontend dependencies...
cd ..\frontend
npm install react-google-login
echo Frontend dependencies installed!

echo.
echo Setup complete! 
echo.
echo Next steps:
echo 1. Copy env.example to .env in the backend folder
echo 2. Add your Google OAuth credentials to the .env file
echo 3. Start MongoDB
echo 4. Run: npm run dev (in backend folder)
echo 5. Run: npm start (in frontend folder)
echo.
pause






