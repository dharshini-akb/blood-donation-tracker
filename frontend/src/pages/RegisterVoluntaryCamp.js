import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { voluntaryCampAPI } from '../services/api';

const RegisterVoluntaryCamp = () => {
  const [formData, setFormData] = useState({
    campName: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    city: '',
    address: '',
    date: '',
    startTime: '',
    endTime: '',
    expectedDonors: '',
    description: '',
    requirements: '',
    facilities: [],
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const cities = [
    'Erode',
    'Perundurai',
    'Bhavani',
    'Gobichettipalayam',
    'Sathyamangalam',
    'Modakurichi',
    'Anthiyur',
    'Kavindapadi',
    'Chithode',
    'Nasiyanur',
    'Kodumudi',
    'Nambiyur',
    'Ammapet',
    'Punjai Puliampatti',
    'Others'
  ];

  const facilityOptions = [
    'Parking Available',
    'Refreshments Provided',
    'Health Checkup',
    'Educational Session',
    'Wheelchair Accessible',
    'Air Conditioning',
    'Restrooms',
    'First Aid Station'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await voluntaryCampAPI.register(formData);
      setMessage(response.data.message);
      
      // Reset form
      setFormData({
        campName: '',
        organizerName: '',
        organizerEmail: '',
        organizerPhone: '',
        city: '',
        address: '',
        date: '',
        startTime: '',
        endTime: '',
        expectedDonors: '',
        description: '',
        requirements: '',
        facilities: [],
        additionalInfo: ''
      });
    } catch (error) {
      console.error('Camp registration error:', error);
      setMessage(error.response?.data?.message || 'Failed to register camp. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-800 mb-4">
            Register Voluntary Blood Camp
          </h1>
          <p className="text-xl text-secondary-600">
            Organize your own blood donation event and help save lives
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className="p-4 rounded-lg mb-6 bg-green-100 text-green-700 border border-green-300">
            {message}
          </div>
        )}

        {/* Registration Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Camp Information */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                Basic Camp Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="campName" className="form-label">
                    Camp Name *
                  </label>
                  <input
                    type="text"
                    id="campName"
                    name="campName"
                    required
                    value={formData.campName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Community Blood Drive 2024"
                  />
                </div>

                <div>
                  <label htmlFor="expectedDonors" className="form-label">
                    Expected Number of Donors *
                  </label>
                  <input
                    type="number"
                    id="expectedDonors"
                    name="expectedDonors"
                    required
                    min="10"
                    max="1000"
                    value={formData.expectedDonors}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>

            {/* Organizer Information */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                Organizer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organizerName" className="form-label">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    id="organizerName"
                    name="organizerName"
                    required
                    value={formData.organizerName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="organizerEmail" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="organizerEmail"
                    name="organizerEmail"
                    required
                    value={formData.organizerEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="organizerPhone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="organizerPhone"
                    name="organizerPhone"
                    required
                    value={formData.organizerPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="form-label">
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="form-label">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Street address, city, state, zip code"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                Date and Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="date" className="form-label">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="form-label">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="form-label">
                    End Time *
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Camp Details */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                Camp Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="form-label">
                    Camp Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe your blood donation camp, its purpose, and what makes it special..."
                  />
                </div>

                <div>
                  <label htmlFor="requirements" className="form-label">
                    Donor Requirements *
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    required
                    rows="3"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Age 18+, Weight 110+ lbs, Good health, Valid ID required"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Available Facilities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {facilityOptions.map(facility => (
                      <label key={facility} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="form-label">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows="3"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Any additional information about your camp..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <Link to="/" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Register Camp'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterVoluntaryCamp;

