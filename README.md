# Blood Donation Tracker

A full-stack web application for tracking blood donations, managing donor information, and handling blood requests.

## Features

- **Blood Availability Search**: Check blood group availability
- **Donor Management**: User registration and login system
- **Blood Request System**: Request blood when not available
- **Blood Center Directory**: Information about blood centers
- **Donation Camps**: Information about blood donation camps
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcrypt
- **Database**: MongoDB

## Project Structure

```
blood-donation-tracker/
├── backend/          # Node.js + Express backend
├── frontend/         # React frontend
├── package.json      # Root package.json
└── README.md         # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. **Clone the repository** (if using git):
   ```bash
   git clone <repository-url>
   cd blood-donation-tracker
   ```

2. **Install all dependencies** (root, backend, and frontend):
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

## Configuration

### Backend Configuration

1. Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blood-donation-tracker
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

2. **For MongoDB Atlas**: Replace the MONGODB_URI with your connection string

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. If you change the backend port, update the API base URL in `frontend/src/services/api.js`.

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```

### Option 2: Run Separately

**Start Backend (Port 5000):**
```bash
npm run backend
```

**Start Frontend (Port 3000):**
```bash
npm run frontend
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/blood/availability/:bloodGroup` - Check blood availability
- `POST /api/blood/request` - Request blood

## Features

### Home Page
- Slideshow of blood donation posters
- Services overview with 6 main features
- Responsive design with red theme

### Authentication
- User registration with name, email, password, and blood group
- Secure login with JWT tokens
- Password hashing with bcrypt

### Blood Management
- Search blood availability by group
- Request blood when not available
- Track blood requests

## Troubleshooting

1. **Port already in use**: Make sure ports 3000 and 5000 are available
2. **MongoDB connection error**: Check your MongoDB installation and connection string
3. **Module not found**: Run `npm run install-all` to ensure all dependencies are installed

## Development

- Backend runs on port 5000 with nodemon for auto-restart
- Frontend runs on port 3000 with React development server
- MongoDB should be running locally or accessible via Atlas

## License

MIT License

