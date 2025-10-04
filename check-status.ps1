Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Blood Donation Tracker - Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking if servers are running..." -ForegroundColor Yellow
Write-Host ""

# Check Backend Server
Write-Host "Backend Server (Port 5001):" -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/health" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend server is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend server responded with error" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend server is not running" -ForegroundColor Red
    Write-Host "   Please run: cd backend; npm start" -ForegroundColor Yellow
}

Write-Host ""

# Check Frontend Server
Write-Host "Frontend Server (Port 3000):" -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend server is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend server responded with error" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend server is not running" -ForegroundColor Red
    Write-Host "   Please run: cd frontend; npm start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Start Commands:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start backend:" -ForegroundColor White
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "To start frontend (in new terminal):" -ForegroundColor White
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "To start both at once:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Features to Test:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Chat - Ask questions about blood donation" -ForegroundColor White
Write-Host "2. Schedule Donation - Click any blood center's 'Schedule Donation'" -ForegroundColor White
Write-Host "3. Blood Requests - Submit requests on Blood Availability page" -ForegroundColor White
Write-Host "4. Voluntary Camps - Register a new camp" -ForegroundColor White
Write-Host ""
Write-Host "All data will be saved to MongoDB!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue"
