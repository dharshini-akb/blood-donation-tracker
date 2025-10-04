import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BloodAvailability = () => {
  const { user } = useAuth();
  const [bloodGroup, setBloodGroup] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: '',
    location: '',
    contact: '',
    urgency: 'normal',
    additionalInfo: ''
  });

  // Tamil Nadu-specific blood availability data
  const bloodAvailabilityData = {
    'A+': {
      available: true,
      units: 45,
      donors: [
        { name: 'Arun Kumar', location: 'Chennai', lastDonation: '2024-01-15', contact: '+91 9876543210' },
        { name: 'Priya Lakshmi', location: 'Coimbatore', lastDonation: '2024-01-20', contact: '+91 9123456780' },
        { name: 'Vigneshwaran', location: 'Madurai', lastDonation: '2024-01-18', contact: '+91 9345678901' }
      ]
    },
    'A-': { available: true, units: 23, donors: [{ name: 'Lakshmi Narayanan', location: 'Trichy', lastDonation: '2024-01-22', contact: '+91 9012345678' }, { name: 'Karthikeyan Raj', location: 'Salem', lastDonation: '2024-01-19', contact: '+91 9087654321' }] },
    'B+': { available: true, units: 38, donors: [{ name: 'Meena Devi', location: 'Erode', lastDonation: '2024-01-21', contact: '+91 9786543210' }, { name: 'Suresh Kumar', location: 'Tirunelveli', lastDonation: '2024-01-17', contact: '+91 9345012345' }] },
    'B-': { available: false, units: 0, donors: [] },
    'AB+': { available: true, units: 15, donors: [{ name: 'Anitha Sekar', location: 'Vellore', lastDonation: '2024-01-23', contact: '+91 9443312345' }] },
    'AB-': { available: false, units: 0, donors: [] },
    'O+': { available: true, units: 67, donors: [{ name: 'Ravi Chandran', location: 'Thanjavur', lastDonation: '2024-01-16', contact: '+91 9884567890' }, { name: 'Divya Shree', location: 'Kanchipuram', lastDonation: '2024-01-24', contact: '+91 9364512345' }, { name: 'Sathish Kumar', location: 'Nagapattinam', lastDonation: '2024-01-14', contact: '+91 9845012345' }] },
    'O-': { available: true, units: 12, donors: [{ name: 'Janani Murugan', location: 'Dharmapuri', lastDonation: '2024-01-25', contact: '+91 9098765432' }] }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'normal', label: 'Normal (Within 24 hours)', color: 'text-green-600' },
    { value: 'urgent', label: 'Urgent (Within 12 hours)', color: 'text-orange-600' },
    { value: 'emergency', label: 'Emergency (Immediate)', color: 'text-red-600' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!bloodGroup) return;

    setIsSearching(true);
    setSearchResult(null);
    setShowRequestForm(false);

    setTimeout(() => {
      const result = bloodAvailabilityData[bloodGroup];
      setSearchResult(result);
      setIsSearching(false);
    }, 1000);
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/blood-requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestForm)
      });

      if (response.ok) {
        alert('Blood request submitted successfully! We will contact you shortly.');
        setShowRequestForm(false);
        setRequestForm({
          patientName: '',
          bloodGroup: '',
          location: '',
          contact: '',
          urgency: 'normal',
          additionalInfo: ''
        });
      } else {
        alert('Error submitting request. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto pt-24">
      <h1 className="text-2xl font-bold mb-4">Blood Availability in Tamil Nadu</h1>
      {user && <p className="mb-4">Welcome, {user.name}!</p>}

      <form onSubmit={handleSearch} className="mb-6">
        <label className="mr-2">Select Blood Group:</label>
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value="">--Select--</option>
          {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>
        <button type="submit" className="bg-red-600 text-white px-4 py-1">Search</button>
      </form>

      {isSearching && <p>Searching...</p>}

      {searchResult && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {bloodGroup} Availability: {searchResult.available ? `${searchResult.units} units` : 'Not Available'}
          </h2>
          {searchResult.donors.length > 0 && (
            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Location</th>
                  <th className="border px-2 py-1">Last Donation</th>
                  <th className="border px-2 py-1">Contact</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.donors.map((donor, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{donor.name}</td>
                    <td className="border px-2 py-1">{donor.location}</td>
                    <td className="border px-2 py-1">{formatDate(donor.lastDonation)}</td>
                    <td className="border px-2 py-1">{donor.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            onClick={() => setShowRequestForm(true)}
            className="bg-red-600 text-white px-4 py-1"
          >
            Request Blood
          </button>
        </div>
      )}

      {showRequestForm && (
        <form onSubmit={handleRequestSubmit} className="border p-4">
          <h3 className="font-semibold mb-2">Blood Request Form</h3>
          <div className="mb-2">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={requestForm.patientName}
              onChange={handleRequestFormChange}
              className="border p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <select
              name="bloodGroup"
              value={requestForm.bloodGroup}
              onChange={handleRequestFormChange}
              className="border p-1 w-full"
              required
            >
              <option value="">--Select Blood Group--</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="mb-2">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={requestForm.location}
              onChange={handleRequestFormChange}
              className="border p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={requestForm.contact}
              onChange={handleRequestFormChange}
              className="border p-1 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <select
              name="urgency"
              value={requestForm.urgency}
              onChange={handleRequestFormChange}
              className="border p-1 w-full"
            >
              {urgencyLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <textarea
              name="additionalInfo"
              placeholder="Additional Info"
              value={requestForm.additionalInfo}
              onChange={handleRequestFormChange}
              className="border p-1 w-full"
            />
          </div>
          <button type="submit" className="bg-red-600 text-white px-4 py-1">
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default BloodAvailability;
