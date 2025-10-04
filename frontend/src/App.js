import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import AuthCallback from './components/AuthCallback';
import Welcome from './pages/Welcome';
import { useMemo } from 'react';
import BloodAvailability from './pages/BloodAvailability';
import BloodCenterDirectory from './pages/BloodCenterDirectory';
import BloodDonationCamps from './pages/BloodDonationCamps';
import BloodDonationSchedule from './pages/BloodDonationSchedule';
import RegisterVoluntaryCamp from './pages/RegisterVoluntaryCamp';
import LearnAboutDonation from './pages/LearnAboutDonation';
import './App.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          {/* Role-specific modules */}
          <Route path="/admin" element={<ProtectedRoute roles={["Admin"]}><Welcome /></ProtectedRoute>} />
          <Route path="/donor" element={<ProtectedRoute roles={["Donor"]}><Welcome /></ProtectedRoute>} />
          <Route path="/patient" element={<ProtectedRoute roles={["Patient"]}><Welcome /></ProtectedRoute>} />
            <Route path="/availability" element={<BloodAvailability />} />
            <Route path="/directory" element={<BloodCenterDirectory />} />
            <Route path="/camps" element={<BloodDonationCamps />} />
            <Route path="/schedule" element={<ProtectedRoute><BloodDonationSchedule /></ProtectedRoute>} />
            <Route path="/register-camp" element={<RegisterVoluntaryCamp />} />
            <Route path="/learn" element={<LearnAboutDonation />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
