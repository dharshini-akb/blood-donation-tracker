# Blood Donation Tracker - Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

## Quick Start (Windows)
1. **Start Backend:** Double-click `start-backend.bat` in the root directory
2. **Start Frontend:** Double-click `start-frontend.bat` in the root directory
3. **Access Application:** Open http://localhost:3000 in your browser

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend directory with the following content:
```env
MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
PORT=5001
```

**Important:** Change the JWT_SECRET to a secure random string in production!

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as a service)
# MongoDB should start automatically

# On macOS/Linux
mongod
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5001`

### 5. Test Backend
Run the test script to verify everything is working:
```bash
cd ..
node test-connection.js
```

Or test MongoDB connection directly:
```bash
node test-mongodb.js
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Features Implemented

### ✅ Authentication
- User registration with validation
- User login with JWT tokens
- Protected routes with middleware
- User profile management

### ✅ Voluntary Camp Registration
- Complete camp registration form
- Data validation and storage in MongoDB
- Admin endpoints for camp management

### ✅ User Interface
- Responsive design with Tailwind CSS
- Navigation with user authentication status
- Welcome message showing logged-in user's name

## Troubleshooting

### Common Issues

1. **"Server error" messages**
   - Check if MongoDB is running
   - Verify backend server is started on port 5001
   - Check console for detailed error messages

2. **Login/Registration not working**
   - Ensure backend is running
   - Check MongoDB connection
   - Verify JWT_SECRET is set in .env file

3. **User name not showing**
   - Check browser console for errors
   - Verify user data is stored in localStorage
   - Check if JWT token is valid

4. **Voluntary camp registration fails**
   - Ensure all required fields are filled
   - Check backend logs for validation errors
   - Verify MongoDB connection

### Debug Steps

1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Test API endpoints with Postman or similar tool
5. Check network tab in browser dev tools

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

### Voluntary Camps
- `POST /api/voluntary-camp/register` - Register new camp
- `GET /api/voluntary-camp/all` - Get all camps (admin)
- `GET /api/voluntary-camp/pending` - Get pending camps (admin)
- `PUT /api/voluntary-camp/:id/status` - Update camp status (admin)

### Health Check
- `GET /api/health` - Backend health status

## Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- Input validation on all endpoints
- CORS enabled for frontend communication
- Environment variables for sensitive data

## Next Steps

1. Add blood availability tracking
2. Implement blood request system
3. Add admin dashboard
4. Email notifications
5. Mobile app development
