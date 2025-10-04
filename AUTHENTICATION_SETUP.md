# Blood Donation Tracker - Full Stack Authentication System

A comprehensive blood donation tracking system with authentication, Google OAuth, and scheduling functionality.

## ✨ Features

### Authentication System
- **Signup/Login** for Patients and Donors
- **Google OAuth 2.0** integration
- **JWT-based** session management
- **Password hashing** with bcrypt
- **Role-based** access control

### Blood Donation Scheduling
- **Patients** can request blood donations at scheduled times
- **Donors** can confirm their availability
- **Real-time** schedule management
- **Status tracking** (pending, confirmed, completed, cancelled)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google OAuth 2.0 credentials

### 1. Setup Google OAuth 2.0
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5001/api/auth/google/callback` (development)
   - Your production URL (production)

### 2. Environment Setup
```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit backend/.env with your credentials
MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Install Dependencies
```bash
# Run the setup script
./setup-auth.bat  # Windows
# or manually:
cd backend && npm install passport passport-google-oauth20 passport-jwt
cd ../frontend && npm install react-google-login
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 📁 Project Structure

```
blood-donation-tracker/
├── backend/
│   ├── config/
│   │   └── passport.js          # Passport configuration
│   ├── models/
│   │   ├── User.js              # User model with Google OAuth support
│   │   └── Schedule.js           # Blood donation schedule model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── scheduleRoutes.js    # Schedule management routes
│   ├── server.js                # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js         # Login component with Google OAuth
│   │   │   ├── Register.js      # Registration component
│   │   │   └── AuthCallback.js  # OAuth callback handler
│   │   ├── pages/
│   │   │   └── BloodDonationSchedule.js # Schedule directory
│   │   └── contexts/
│   │       └── AuthContext.js   # Authentication context
│   └── package.json
└── setup-auth.bat              # Setup script
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user

### Schedules
- `GET /api/schedules` - Get schedules (role-based filtering)
- `POST /api/schedules` - Create new schedule (Patients only)
- `PATCH /api/schedules/:id` - Update schedule status
- `GET /api/schedules/:id` - Get specific schedule
- `DELETE /api/schedules/:id` - Delete schedule (Patient only)

## 👥 User Roles

### Patient
- Create blood donation schedules
- View their own schedules
- Cancel their schedules
- Mark schedules as completed

### Donor
- View available schedules matching their blood group
- Confirm availability for schedules
- View schedules they've confirmed
- Mark schedules as completed

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **Google OAuth**: Secure third-party authentication
- **Role-based Access**: Different permissions for Patients and Donors
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend-backend communication

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop and mobile
- **Google Login Button**: Integrated Google OAuth
- **Schedule Management**: Create, view, and manage schedules
- **Real-time Updates**: Live schedule status updates
- **User-friendly Interface**: Clean, intuitive design

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Railway, or your preferred platform

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Update `FRONTEND_URL` in backend environment

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration (Patient/Donor)
- [ ] User login with email/password
- [ ] Google OAuth login
- [ ] Schedule creation (Patient)
- [ ] Schedule confirmation (Donor)
- [ ] Schedule cancellation
- [ ] Role-based access control

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001
```

## 🐛 Troubleshooting

### Common Issues
1. **Google OAuth not working**: Check redirect URI configuration
2. **MongoDB connection error**: Ensure MongoDB is running
3. **CORS errors**: Verify frontend URL in backend CORS config
4. **JWT errors**: Check JWT_SECRET configuration

### Debug Mode
```bash
# Backend with debug logs
DEBUG=* npm run dev

# Frontend with detailed logs
REACT_APP_DEBUG=true npm start
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for frontend errors
4. Check server logs for backend errors

## 🔄 Updates

### Recent Updates
- Added Google OAuth 2.0 integration
- Implemented blood donation scheduling
- Added role-based access control
- Enhanced UI with Tailwind CSS
- Added real-time schedule management

---

**Built with ❤️ for the Blood Donation Community**






