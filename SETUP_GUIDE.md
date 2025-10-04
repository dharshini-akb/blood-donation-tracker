# Blood Donation Tracker - Complete Setup Guide

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
setup-complete.bat
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm run install-all

# 2. Configure Gemini API
# Edit backend/.env and add your Gemini API key:
# GEMINI_API_KEY=your-api-key-here
# AI_PROVIDER=gemini

# 3. Start both servers
npm run dev
```

## 🔧 Manual Server Start

### Backend Server
```bash
cd backend
npm start
```

### Frontend Server (in new terminal)
```bash
cd frontend
npm start
```

## 🧪 Testing Setup

### Check Server Status
```bash
# PowerShell
.\check-status.ps1

# Command Prompt
check-status.bat
```

### Test Gemini API
```bash
node test-setup.js
```

## 🎯 Features to Test

### 1. Dynamic AI Chat
- Open the chat feature
- Ask questions like:
  - "What are blood donation requirements?"
  - "How often can I donate blood?"
  - "What blood types are compatible?"

### 2. Schedule Donation
- Go to Blood Centers page
- Click "Schedule Donation" on any blood center
- Fill the form and submit
- Data will be saved to MongoDB

### 3. Blood Requests
- Go to Blood Availability page
- Search for a blood group
- Click "Request Blood"
- Fill the form and submit
- Data will be saved to MongoDB

### 4. Voluntary Camp Registration
- Go to Register Voluntary Camp page
- Fill all required fields
- Submit the form
- Data will be saved to MongoDB

## 🔑 Getting Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key
4. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=your-api-key-here
   AI_PROVIDER=gemini
   ```

## 📊 Database Models

- **BloodRequest**: Stores blood requests from patients
- **Donation**: Stores scheduled donations at blood centers
- **VoluntaryCamp**: Stores voluntary camp registrations
- **User**: Stores user accounts and authentication

## 🌐 Server URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## 🐛 Troubleshooting

### Backend not starting
- Check if MongoDB is running
- Verify `.env` file exists in backend directory
- Check port 5001 is not in use

### Frontend not starting
- Check if port 3000 is not in use
- Verify all dependencies are installed
- Check for any build errors

### Chat not working
- Verify Gemini API key is correct
- Check backend logs for API errors
- Ensure backend server is running

### Forms not saving
- Check MongoDB connection
- Verify backend routes are working
- Check browser console for errors

## 📝 Environment Variables

Create `backend/.env` with:
```
MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001
FRONTEND_URL=http://localhost:3000
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-pro
```

## ✅ Success Indicators

- Backend server shows "✅ Connected to MongoDB"
- Frontend opens at http://localhost:3000
- Chat responds with AI-generated answers
- Forms save data successfully
- No console errors in browser

## 🎉 You're All Set!

Your Blood Donation Tracker is now fully functional with:
- ✅ Dynamic AI chat powered by Gemini
- ✅ MongoDB data storage
- ✅ Blood request submissions
- ✅ Donation scheduling
- ✅ Voluntary camp registration
