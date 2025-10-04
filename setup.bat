@echo off
echo Setting up Blood Donation Tracker...
echo.

echo Installing root dependencies...
npm install

echo.
echo Installing backend dependencies...
cd backend
npm install
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Start MongoDB (if running locally)
echo 2. Create .env file in backend folder (copy from env.example)
echo 3. Run: npm run dev
echo.
echo Or run separately:
echo - Backend: npm run backend
echo - Frontend: npm run frontend
echo.
pause

