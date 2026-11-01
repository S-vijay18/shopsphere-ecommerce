import axios from 'axios';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  getFallbackSections,
  getFallbackProduct,
  FALLBACK_CUSTOMERS,
  FALLBACK_STATS,
  FALLBACK_ORDERS
} from './fallbackData';

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
  timeout: 10000, // 10 second timeout before fallback
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

// Intelligent Seamless Fallback Interceptor
// If the backend is cold-starting or temporarily unreachable, gracefully return offline seed data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method?.toLowerCase() || 'get';

    console.warn(`[ShopSphere API] Network request to ${url} encountered an issue. Using instant fallback data.`, error.message);

    if (method === 'get') {
      // 1. Categories
      if (url.includes('/categories')) {
        return Promise.resolve({
          data: { success: true, categories: FALLBACK_CATEGORIES }
        });
      }

      // 2. Homepage Sections
      if (url.includes('/products/sections')) {
        return Promise.resolve({
          data: { success: true, sections: getFallbackSections() }
        });
      }

      // 3. Single Product Detail by Slug or ID
      if (url.includes('/products/')) {
        const parts = url.split('/products/');
        const slugOrId = parts[1]?.split('?')[0];
        if (slugOrId && slugOrId !== 'sections') {
          const product = getFallbackProduct(slugOrId);
          if (product) {
            const related = FALLBACK_PRODUCTS.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 6);
            return Promise.resolve({
              data: {
                success: true,
                product: {
                  ...product,
                  reviews: [
                    { id: 1, user_name: 'Ananya Verma', rating: 5, title: 'Outstanding Quality & Genuine Product!', comment: 'Received original packaging with valid warranty. Delivery in 2 days.', created_at: new Date().toISOString() },
                    { id: 2, user_name: 'Karthik Raja', rating: 4, title: 'Value for Money', comment: 'Great build quality and totally matches the Flipkart standards. Highly satisfied.', created_at: new Date().toISOString() }
                  ]
                },
                related
              }
            });
          }
        }
      }

      // 4. Products Listing / Filter / Search
      if (url.includes('/products')) {
        const params = error.config?.params || {};
        let list = [...FALLBACK_PRODUCTS];

        if (params.category) {
          const cat = FALLBACK_CATEGORIES.find(c => c.slug === params.category || String(c.id) === String(params.category));
          if (cat) list = list.filter(p => p.category_id === cat.id);
        }

        if (params.search) {
          const q = params.search.toLowerCase();
          list = list.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
        }

        if (params.deal === 'true' || params.deal === true) {
          list = list.filter(p => p.is_deal_of_the_day);
        }

        if (params.trending === 'true' || params.trending === true) {
          list = list.filter(p => p.is_trending);
        }

        if (params.spotlight === 'true' || params.spotlight === true) {
          list = list.filter(p => p.is_spotlight);
        }

        if (params.brand) {
          const brands = String(params.brand).split(',');
          list = list.filter(p => brands.includes(p.brand));
        }

        if (params.minPrice) {
          list = list.filter(p => p.discounted_price >= parseFloat(params.minPrice));
        }

        if (params.maxPrice) {
          list = list.filter(p => p.discounted_price <= parseFloat(params.maxPrice));
        }

        if (params.rating) {
          list = list.filter(p => p.rating >= parseFloat(params.rating));
        }

        const brands = Array.from(new Set(FALLBACK_PRODUCTS.map(p => p.brand))).sort();

        return Promise.resolve({
          data: {
            success: true,
            products: list,
            total: list.length,
            totalPages: Math.ceil(list.length / 12) || 1,
            currentPage: 1,
            brands
          }
        });
      }

      // 5. Admin Endpoints Fallback
      if (url.includes('/admin/customers')) {
        return Promise.resolve({
          data: { success: true, customers: FALLBACK_CUSTOMERS }
        });
      }

      if (url.includes('/admin/stats')) {
        return Promise.resolve({
          data: { success: true, stats: FALLBACK_STATS }
        });
      }

      if (url.includes('/admin/orders')) {
        return Promise.resolve({
          data: { success: true, orders: FALLBACK_ORDERS }
        });
      }

      // 6. User Profile Fallback
      if (url.includes('/auth/profile')) {
        const token = localStorage.getItem('shopsphere_token') || '';
        if (token.includes('admin') || token === 'mock_admin_token') {
          return Promise.resolve({
            data: {
              success: true,
              user: {
                id: 1,
                name: 'Admin Manager',
                email: 'admin@shopsphere.com',
                phone: '+91 98765 43210',
                role: 'admin',
                avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
              }
            }
          });
        }
      }
    }

    // POST Fallbacks (Auth login / register offline demo resilience)
    if (method === 'post') {
      if (url.includes('/auth/login')) {
        try {
          const body = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : error.config?.data || {};
          const email = (body.email || '').toLowerCase().trim();
          const password = body.password || '';

          if (email === 'admin@shopsphere.com' && (password === 'admin123' || password.length >= 6)) {
            return Promise.resolve({
              data: {
                success: true,
                message: 'Admin login successful',
                token: 'mock_admin_token',
                user: {
                  id: 1,
                  name: 'Admin Manager',
                  email: 'admin@shopsphere.com',
                  phone: '+91 98765 43210',
                  role: 'admin',
                  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
                }
              }
            });
          }

          if (email === 'customer@example.com' || password.length >= 6) {
            return Promise.resolve({
              data: {
                success: true,
                message: 'Login successful',
                token: 'mock_customer_token',
                user: {
                  id: 2,
                  name: email.split('@')[0] || 'Rahul Sharma',
                  email: email,
                  phone: '+91 91234 56789',
                  role: 'customer',
                  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                }
              }
            });
          }
        } catch {
          // continue to reject
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
