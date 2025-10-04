import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BloodDonationCamps = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Erode-specific donation camps data
  const donationCamps = [
    {
      id: 1,
      name: "Erode Community Blood Drive",
      organizer: "Erode Red Cross Society",
      city: "Erode",
      address: "Community Hall, 12 Main Street, Erode",
      date: "2025-09-10",
      time: "9:00 AM - 5:00 PM",
      expectedDonors: 100,
      registeredDonors: 65,
      description: "Join us for our annual Erode community blood drive. Free health checkup included.",
      requirements: ["Age 18+", "Weight 110+ lbs", "Good health", "Valid ID"],
      contact: "+91 9876543210",
      email: "erode@redcross.org"
    },
    {
      id: 2,
      name: "TechCorp Erode Blood Donation Camp",
      organizer: "TechCorp Erode",
      city: "Erode",
      address: "TechCorp Campus, 45 Industrial Area, Erode",
      date: "2025-09-15",
      time: "8:00 AM - 6:00 PM",
      expectedDonors: 120,
      registeredDonors: 90,
      description: "Employees and public welcome. Refreshments provided.",
      requirements: ["Age 18+", "Weight 110+ lbs", "Good health", "Valid ID"],
      contact: "+91 9123456780",
      email: "bloodcamp@techcorp-erode.com"
    },
    {
      id: 3,
      name: "Erode University Blood Camp",
      organizer: "Erode State University",
      city: "Erode",
      address: "University Campus, 67 College Road, Erode",
      date: "2025-09-20",
      time: "10:00 AM - 4:00 PM",
      expectedDonors: 80,
      registeredDonors: 50,
      description: "Students, faculty, and community members welcome. Educational session included.",
      requirements: ["Age 18+", "Weight 110+ lbs", "Good health", "Student ID or Valid ID"],
      contact: "+91 9012345678",
      email: "bloodcamp@erodeuniversity.edu"
    },
    {
      id: 4,
      name: "Erode Emergency Blood Collection",
      organizer: "Erode City Emergency Services",
      city: "Erode",
      address: "Emergency Center, 23 Safety Lane, Erode",
      date: "2025-09-25",
      time: "24 Hours",
      expectedDonors: 150,
      registeredDonors: 110,
      description: "Emergency blood collection to replenish local blood banks.",
      requirements: ["Age 18+", "Weight 110+ lbs", "Good health", "Valid ID"],
      contact: "+91 9345678901",
      email: "emergency@erode.gov"
    }
  ];

  const cities = [...new Set(donationCamps.map(camp => camp.city))];

  const filteredCamps = donationCamps.filter(camp => {
    const matchesCity = !selectedCity || camp.city === selectedCity;
    const matchesDate = !selectedDate || camp.date >= selectedDate;
    return matchesCity && matchesDate;
  });

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const campDate = new Date(dateString);
    const diffTime = campDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-800 mb-4">
            Blood Donation Camps in Erode
          </h1>
          <p className="text-xl text-secondary-600">
            Find and join upcoming blood donation events in your city
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="form-label">
                Filter by City
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="form-label">
                From Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-secondary-600">
            Found {filteredCamps.length} donation camp{filteredCamps.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Camps Grid */}
        <div className="space-y-6">
          {filteredCamps.map(camp => {
            const daysUntil = getDaysUntil(camp.date);
            const isUpcoming = daysUntil > 0;
            const isToday = daysUntil === 0;
            
            return (
              <div key={camp.id} className="card hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Camp Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-secondary-800 mb-2">
                          {camp.name}
                        </h3>
                        <p className="text-primary-600 font-medium mb-1">
                          Organized by {camp.organizer}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isToday 
                            ? 'bg-green-100 text-green-800' 
                            : isUpcoming 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isToday ? 'Today' : isUpcoming ? `${daysUntil} day${daysUntil !== 1 ? 's' : ''} away` : 'Past'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <span className="text-primary-600 mr-2">📍</span>
                        <div>
                          <p className="font-medium text-secondary-800">{camp.city}</p>
                          <p className="text-sm text-secondary-600">{camp.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-primary-600 mr-2">📅</span>
                        <div>
                          <p className="font-medium text-secondary-800">{formatDate(camp.date)}</p>
                          <p className="text-sm text-secondary-600">{camp.time}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-secondary-700 mb-4">{camp.description}</p>

                    <div className="mb-4">
                      <h4 className="font-medium text-secondary-800 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {camp.requirements.map((req, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-secondary-600">Expected</p>
                          <p className="text-lg font-semibold text-secondary-800">{camp.expectedDonors}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-secondary-600">Registered</p>
                          <p className="text-lg font-semibold text-primary-600">{camp.registeredDonors}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-secondary-600">Available</p>
                          <p className="text-lg font-semibold text-green-600">{camp.expectedDonors - camp.registeredDonors}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="lg:w-80 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-secondary-800 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-primary-600 mr-2">📞</span>
                          <a 
                            href={`tel:${camp.contact}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {camp.contact}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="text-primary-600 mr-2">✉️</span>
                          <a 
                            href={`mailto:${camp.email}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {camp.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {isUpcoming || isToday ? (
                        <>
                          <button className="btn-primary w-full">
                            Register for Donation
                          </button>
                          <button className="btn-outline w-full">
                            Get Directions
                          </button>
                        </>
                      ) : (
                        <button className="btn-secondary w-full" disabled>
                          Camp Ended
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCamps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              No donation camps found
            </h3>
            <p className="text-secondary-600 mb-6">
              Try adjusting your filters or check back later for new camps
            </p>
            <button 
              onClick={() => { setSelectedCity(''); setSelectedDate(''); }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationCamps;
