import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

const Welcome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleSpecificInfo = () => {
    if (user?.role === 'Patient') {
      return {
        title: 'Patient Dashboard',
        description: 'Manage your blood donation requests and track your health records.',
        features: [
          'Request blood donations',
          'Track donation history',
          'Find nearby blood centers'
        ]
      };
    } else if (user?.role === 'Donor') {
      return {
        title: 'Donor Dashboard',
        description: 'Help save lives by donating blood and connecting with patients.',
        bloodGroup: user.bloodGroup,
        features: [
          'Schedule blood donations',
          'Track donation history',
          'Find donation centers'
        ]
      };
    }
    return {
      title: 'Welcome',
      description: 'Welcome to the Blood Donation Tracker.',
      features: []
    };
  };

  const roleInfo = getRoleSpecificInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user?.name || "User"}!
              </h1>
              <p className="text-gray-600 mt-2">{roleInfo.description}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

    
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Name:</span> {user?.name}</p>
              <p><span className="font-medium">Email:</span> {user?.email || "Not provided"}</p>
              <p><span className="font-medium">Role:</span> {user?.role || "N/A"}</p>
            </div>
            <div>
              {user?.role === 'Donor' && user?.bloodGroup && (
                <p><span className="font-medium">Blood Group:</span> {user.bloodGroup}</p>
              )}
            </div>
          </div>
        </div>

      
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/availability')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Check Blood Availability
            </button>
            <button
              onClick={() => navigate('/directory')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Find Blood Centers
            </button>
            {/* Camps page removed */}
            <button
              onClick={() => setShowChatbot(true)}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
            >
              Open Chat
            </button>
          </div>
        </div>

      
        {showChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chat Support</h3>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <Chatbot />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
