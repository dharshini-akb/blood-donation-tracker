import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bloodAPI } from '../services/api';

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



  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'normal', label: 'Normal (Within 24 hours)', color: 'text-green-600' },
    { value: 'urgent', label: 'Urgent (Within 12 hours)', color: 'text-orange-600' },
    { value: 'emergency', label: 'Emergency (Immediate)', color: 'text-red-600' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bloodGroup) return;

    setIsSearching(true);
    setSearchResult(null);
    setShowRequestForm(false);

    try {
      const res = await bloodAPI.checkAvailability(bloodGroup);
      setSearchResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch availability';
      alert(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await bloodAPI.createPublicBloodRequest(requestForm);

      if (response.status === 201) {
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
      const msg = error.response?.data?.message || error.message || 'Failed to connect to server.';
      alert(msg);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getValidityStatus = (dateString) => {
    if (!dateString) return { label: 'Unknown', color: 'text-gray-600' };
    const donated = new Date(dateString);
    const expires = new Date(donated.getTime() + 120 * 24 * 60 * 60 * 1000);
    const now = new Date();
    if (now >= expires) return { label: 'Expired', color: 'text-red-600' };
    const daysLeft = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
    return { label: `${daysLeft} days left`, color: daysLeft <= 7 ? 'text-orange-600' : 'text-green-600' };
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
                  <th className="border px-2 py-1">Last Donation</th>
                  <th className="border px-2 py-1">Contact</th>
                  <th className="border px-2 py-1">Validity</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.donors.map((donor, idx) => {
                  const validity = getValidityStatus(donor.lastDonation);
                  return (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{donor.name}</td>
                      <td className="border px-2 py-1">{donor.lastDonation ? formatDate(donor.lastDonation) : '—'}</td>
                      <td className="border px-2 py-1">{donor.contact}</td>
                      <td className={`border px-2 py-1 ${validity.color}`}>{validity.label}</td>
                    </tr>
                  );
                })}
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
