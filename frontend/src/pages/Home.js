import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Get user info from localStorage
  const storedName = localStorage.getItem('userName');
  const storedRole = localStorage.getItem('userRole'); // "donor" or "patient"

  const [user, setUser] = useState(
    storedName ? { name: storedName, role: storedRole } : null
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow images
  const slides = [
    { id: 1, image: process.env.PUBLIC_URL + "/images/poster1.svg" },
    { id: 2, image: process.env.PUBLIC_URL + "/images/poster2.svg" },
    { id: 3, image: process.env.PUBLIC_URL + "/images/poster3.svg" }
  ];

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-70' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-red bg-opacity-10 z-10"></div>
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white px-4"></div>
            </div>
          </div>
        ))}
        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">Our Services</h2>
            <p className="text-xl text-secondary-600">Everything you need for blood donation and management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Blood Availability Search */}
            <div className="card text-center hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Blood Availability Search</h3>
              <p className="text-secondary-600 mb-4">Search for available blood by blood group and request donors if needed</p>
              <Link to="/availability" className="btn-primary">Search Blood</Link>
            </div>

            {/* Blood Center Directory */}
            <div className="card text-center hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Blood Center Directory</h3>
              <p className="text-secondary-600 mb-4">Find blood banks and donation centers near you with detailed info</p>
              <Link to="/directory" className="btn-primary">Find Centers</Link>
            </div>

            {/* Patient Login */}
            <div className="card text-center hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Patient Login</h3>
              <p className="text-secondary-600 mb-4">Access your patient account to request blood or track your requests</p>
              {!user ? (
                <Link to="/login?role=patient" className="btn-primary">Login</Link>
              ) : (
                <div className="text-primary-600 font-medium">
                  Welcome back, {user.name} ({user.role === 'patient' ? 'Patient' : 'Donor'})!
                </div>
              )}
            </div>

            {/* Donor Login */}
            <div className="card text-center hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Donor Login</h3>
              <p className="text-secondary-600 mb-4">Access your donor account to manage donations and requests</p>
              {!user ? (
                <Link to="/login?role=donor" className="btn-primary">Login</Link>
              ) : (
                <div className="text-primary-600 font-medium">
                  Welcome back, {user.name} ({user.role === 'donor' ? 'Donor' : 'Patient'})!
                </div>
              )}
            </div>

            {/* Register Camp */}
            <div className="card text-center hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Register Voluntary Blood Camp</h3>
              <p className="text-secondary-600 mb-4">Organize your own blood donation event and help save lives</p>
              <Link to="/register-camp" className="btn-primary">Register Camp</Link>
            </div>

            {/* Learn About Donation */}
            <div className="card text-center hover:shadow-xl transition-shadow duration-200">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Learn About Donation</h3>
              <p className="text-secondary-600 mb-4">Get educated about blood donation process, benefits, and myths</p>
              <Link to="/learn" className="btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of donors who are saving lives every day.</p>
          {!user ? (
            <div className="space-x-4">
              <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition">Become a Donor</Link>
              <Link to="/login" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition">Sign In</Link>
            </div>
          ) : (
            <Link to="/availability" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition">Check Blood Availability</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
