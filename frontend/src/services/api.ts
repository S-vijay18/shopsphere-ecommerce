import axios from 'axios';

// Automatically detect environment:
// 1. If custom VITE_API_URL is configured, use it
// 2. If running locally on localhost/127.0.0.1, use http://localhost:5000/api
// 3. In production (GitHub Pages or Render), use the deployed Render API backend
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  isLocal
    ? 'http://localhost:5000/api'
    : 'https://shopsphere-ecommerce-0tu0.onrender.com/api'
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token & session ID automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopsphere_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Session ID for guest carts
  let sessionId = localStorage.getItem('shopsphere_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('shopsphere_session_id', sessionId);
  }
  config.headers['x-session-id'] = sessionId;

  return config;
});

export default api;
