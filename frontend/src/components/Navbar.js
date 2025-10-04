import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gradient">Blood Tracker</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/availability" className="nav-link">
              Blood Availability
            </Link>
            <Link to="/directory" className="nav-link">
              Blood Centers
            </Link>
            <Link to="/camps" className="nav-link">
              Donation Camps
            </Link>
            {user && (
              <Link to="/schedule" className="nav-link">
                Schedule Directory
              </Link>
            )}
            <Link to="/learn" className="nav-link">
              Learn
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary-600">
                  Welcome, {user.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <Link
            to="/"
            className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/availability"
            className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blood Availability
          </Link>
          <Link
            to="/directory"
            className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blood Centers
          </Link>
          <Link
            to="/camps"
            className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Donation Camps
          </Link>
          {user && (
            <Link
              to="/schedule"
              className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Schedule Directory
            </Link>
          )}
          <Link
            to="/learn"
            className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Learn
          </Link>
          {user ? (
            <div className="pt-4 pb-3 border-t border-secondary-200">
              <div className="px-3 py-2">
                <span className="text-sm text-secondary-600">
                  Welcome, {user.name || 'User'}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-secondary-200">
              <Link
                to="/login"
                className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-secondary-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
