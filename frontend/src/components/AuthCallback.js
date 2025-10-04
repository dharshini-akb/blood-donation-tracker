import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth context
        setAuthData({ user, token });
        
        // Redirect to welcome page
        navigate('/welcome');
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/login?error=oauth_failed');
      }
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [navigate, setAuthData]);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-red-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

