import React, { useEffect, useState } from 'react';
import { bloodAPI, voluntaryCampAPI } from '../services/api';

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AdminDashboard = () => {
  const [availability, setAvailability] = useState({});
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [camps, setCamps] = useState([]);
  const [loadingCamps, setLoadingCamps] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      setLoadingAvail(true);
      try {
        const entries = await Promise.all(groups.map(async g => {
          try {
            const res = await bloodAPI.checkAvailability(g);
            return [g, res.data];
          } catch (e) {
            return [g, { bloodGroup: g, available: false, units: 0, donors: [] }];
          }
        }));
        setAvailability(Object.fromEntries(entries));
      } catch (e) {
        setError(e.response?.data?.message || e.message || 'Failed to load availability');
      } finally {
        setLoadingAvail(false);
      }

      setLoadingCamps(true);
      try {
        const res = await voluntaryCampAPI.getAllCamps();
        setCamps(res.data?.camps || []);
      } catch (e) {
        setCamps([]);
      } finally {
        setLoadingCamps(false);
      }

      setLoadingReq(true);
      try {
        // Prefer authenticated admin route; fallback to public list
        const res = await bloodAPI.getRequests();
        const items = res.data?.requests || res.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setRequests(items);
        } else {
          const publicRes = await bloodAPI.getPublicRequests();
          setRequests(publicRes.data || []);
        }
      } catch (e) {
        try {
          const publicRes = await bloodAPI.getPublicRequests();
          setRequests(publicRes.data || []);
        } catch {
          setRequests([]);
        }
      } finally {
        setLoadingReq(false);
      }
    };
    load();
  }, []);

  const approved = camps.filter(c => String(c.status || '').toLowerCase() === 'approved');
  const pending = camps.filter(c => String(c.status || 'pending').toLowerCase() !== 'approved');

  const setCampStatus = async (campId, status) => {
    try {
      await voluntaryCampAPI.updateStatus(campId, status);
      setCamps(prev => prev.map(c => {
        const id = c.id || c._id;
        if (id === campId) return { ...c, status };
        return c;
      }));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update camp status');
    }
  };

  const setRequestStatus = async (reqId, status) => {
    try {
      await bloodAPI.updateRequestStatus(reqId, status);
      setRequests(prev => prev.map(r => {
        const id = r.id || r._id;
        if (id === reqId) return { ...r, status };
        return r;
      }));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update request status');
    }
  };

  return (
    <div className="pt-24 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-3">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4">
          <h2 className="text-xl font-semibold mb-3">Blood Availability</h2>
          {loadingAvail ? (
            <div>Loading availability...</div>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Group</th>
                  <th className="border px-2 py-1">Units</th>
                  <th className="border px-2 py-1">Donors</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(g => {
                  const data = availability[g] || { units: 0, donors: [] };
                  return (
                    <tr key={g}>
                      <td className="border px-2 py-1">{g}</td>
                      <td className="border px-2 py-1">{data.units}</td>
                      <td className="border px-2 py-1">{data.donors.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="border p-4">
          <h2 className="text-xl font-semibold mb-3">Donation Camps</h2>
          {loadingCamps ? (
            <div>Loading camps...</div>
          ) : (
            <div>
              <div className="mb-3">Total: {camps.length} | Approved: {approved.length} | Pending: {pending.length}</div>
              <table className="w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Location</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {camps.map((c, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{c.campName || c.name || c.organizerName || c.organizer || '—'}</td>
                      <td className="border px-2 py-1">{c.location || c.address || c.city || '—'}</td>
                      <td className="border px-2 py-1">{c.date || c.campDate || '—'}</td>
                      <td className="border px-2 py-1">{(c.status || 'pending')}</td>
                      <td className="border px-2 py-1">
                        <button
                          className="bg-green-600 text-white px-2 py-1 mr-2 disabled:opacity-50"
                          onClick={() => setCampStatus(c.id || c._id, 'approved')}
                          disabled={String(c.status || '').toLowerCase() === 'approved'}
                        >Approve</button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 disabled:opacity-50"
                          onClick={() => setCampStatus(c.id || c._id, 'rejected')}
                          disabled={String(c.status || '').toLowerCase() === 'rejected'}
                        >Deny</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Blood Requests</h2>
          {loadingReq ? (
            <div>Loading requests...</div>
          ) : requests.length === 0 ? (
            <div>No requests submitted.</div>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Patient</th>
                  <th className="border px-2 py-1">Group</th>
                  <th className="border px-2 py-1">Location</th>
                  <th className="border px-2 py-1">Contact</th>
                  <th className="border px-2 py-1">Urgency</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Created</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="border px-2 py-1">{r.patientName}</td>
                    <td className="border px-2 py-1">{r.bloodGroup}</td>
                    <td className="border px-2 py-1">{r.location}</td>
                    <td className="border px-2 py-1">{r.contact}</td>
                    <td className="border px-2 py-1">{r.urgency}</td>
                    <td className="border px-2 py-1">{r.status}</td>
                    <td className="border px-2 py-1">{r.createdAt ? String(r.createdAt).slice(0, 10) : '-'}</td>
                    <td className="border px-2 py-1">
                      <button
                        className="bg-green-600 text-white px-2 py-1 mr-2 disabled:opacity-50"
                        onClick={() => setRequestStatus(r.id || r._id, 'In Progress')}
                        disabled={String(r.status || '').toLowerCase() === 'in progress' || String(r.status || '').toLowerCase() === 'fulfilled'}
                      >Approve</button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 disabled:opacity-50"
                        onClick={() => setRequestStatus(r.id || r._id, 'Cancelled')}
                        disabled={String(r.status || '').toLowerCase() === 'cancelled'}
                      >Deny</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;