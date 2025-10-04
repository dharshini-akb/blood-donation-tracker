@echo off
echo Creating .env file for Blood Donation Tracker Backend...
echo.

echo MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker > .env
echo JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production >> .env
echo PORT=5001 >> .env

echo.
echo .env file created successfully!
echo.
echo Please review and modify the JWT_SECRET before using in production.
echo.
pause
