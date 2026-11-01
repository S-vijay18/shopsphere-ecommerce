import axios from 'axios';

const API_BASE_URL = 'https://shopsphere-ecommerce-0tu0.onrender.com/api';

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

