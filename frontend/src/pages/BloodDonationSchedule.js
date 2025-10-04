import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BloodDonationSchedule = () => {
  const { user, token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    notes: '',
    urgency: 'medium',
    contactPhone: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/schedules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(response.data);
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/schedules`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateForm(false);
      setFormData({
        bloodGroup: '',
        scheduledDate: '',
        scheduledTime: '',
        location: '',
        notes: '',
        urgency: 'medium',
        contactPhone: ''
      });
      fetchSchedules();
    } catch (err) {
      setError('Failed to create schedule');
      console.error('Error creating schedule:', err);
    }
  };

  const handleConfirmSchedule = async (scheduleId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/schedules/${scheduleId}`, {
        status: 'confirmed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedules();
    } catch (err) {
      setError('Failed to confirm schedule');
      console.error('Error confirming schedule:', err);
    }
  };

  const handleCancelSchedule = async (scheduleId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/schedules/${scheduleId}`, {
        status: 'cancelled'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedules();
    } catch (err) {
      setError('Failed to cancel schedule');
      console.error('Error cancelling schedule:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level ? level.color : 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-red-600">Blood Donation Schedule Directory</h1>
            {user?.role === 'Patient' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Create New Schedule
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Create Schedule Form */}
          {showCreateForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Blood Donation Schedule</h2>
              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group Required</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                    <input
                      type="time"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location (hospital, clinic, etc.)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter contact phone number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes or requirements"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Create Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Schedules List */}
          <div className="space-y-4">
            {schedules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No schedules found.</p>
                {user?.role === 'Patient' && (
                  <p className="text-gray-400 mt-2">Create your first blood donation schedule above.</p>
                )}
              </div>
            ) : (
              schedules.map(schedule => (
                <div key={schedule._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Blood Group: {schedule.bloodGroup}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(schedule.scheduledDate).toLocaleDateString()} at {schedule.scheduledTime}
                      </p>
                      <p className="text-gray-600">Location: {schedule.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getUrgencyColor(schedule.urgency)}-100 text-${getUrgencyColor(schedule.urgency)}-800`}>
                        {schedule.urgency.charAt(0).toUpperCase() + schedule.urgency.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient:</p>
                      <p className="font-medium">{schedule.patient?.name}</p>
                      <p className="text-sm text-gray-600">{schedule.patient?.email}</p>
                    </div>
                    {schedule.donor && (
                      <div>
                        <p className="text-sm text-gray-500">Donor:</p>
                        <p className="font-medium">{schedule.donor?.name}</p>
                        <p className="text-sm text-gray-600">{schedule.donor?.email}</p>
                      </div>
                    )}
                  </div>

                  {schedule.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Notes:</p>
                      <p className="text-gray-700">{schedule.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {user?.role === 'Donor' && schedule.status === 'pending' && !schedule.donor && (
                      <button
                        onClick={() => handleConfirmSchedule(schedule._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        Confirm Availability
                      </button>
                    )}
                    {user?.role === 'Patient' && schedule.patient?._id === user.id && schedule.status !== 'cancelled' && schedule.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelSchedule(schedule._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        Cancel Schedule
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationSchedule;

