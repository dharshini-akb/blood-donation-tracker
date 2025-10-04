// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---------- Auth API ----------
export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

// ---------- Voluntary Camp API ----------
export const voluntaryCampAPI = {
  register: (payload) => api.post('/voluntary-camp/register', payload),
  registerCamp: (payload) => api.post('/voluntary-camp/register', payload),
  getAllCamps: () => api.get('/voluntary-camp/all'),
  getPendingCamps: () => api.get('/voluntary-camp/pending'),
  updateStatus: (id, status) => api.put(`/voluntary-camp/${id}/status`, { status }),
};

// ---------- Blood Requests API (optional if used) ----------
export const bloodAPI = {
  checkAvailability: (bloodGroup) => api.get(`/blood/availability/${bloodGroup}`),
  createRequest: (data) => api.post('/blood/request', data),
  getRequests: () => api.get('/blood/requests'),
  getMyRequests: () => api.get('/blood/requests/my'),
  updateRequestStatus: (id, status) => api.put(`/blood/requests/${id}/status`, { status }),
};

// ---------- Chat API ----------
export const chatAPI = {
  ask: (messages) => api.post('/chat', { messages }),
};

export default api;
