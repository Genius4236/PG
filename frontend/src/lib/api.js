import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and implement retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Implement retry logic for network errors or 5xx server errors
    if (
      !originalRequest._retry &&
      (error.code === 'NETWORK_ERROR' ||
       error.code === 'TIMEOUT' ||
       (error.response?.status >= 500 && error.response?.status < 600))
    ) {
      originalRequest._retry = true;
      const retryDelay = Math.min(1000 * Math.pow(2, originalRequest._retryCount || 0), 10000);

      await new Promise(resolve => setTimeout(resolve, retryDelay));

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

// PG API calls
export const pgAPI = {
  getPGs: (params) => api.get('/pgs', { params }),
  getPG: (id) => api.get(`/pgs/${id}`),
  createPG: (pgData) => {
    // If pgData is FormData, set proper headers
    const config = pgData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/pgs', pgData, config);
  },
  updatePG: (id, pgData) => api.put(`/pgs/${id}`, pgData),
  deletePG: (id) => api.delete(`/pgs/${id}`),
  getOwnerPGs: () => api.get('/owner/pgs'),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/user/bookings'),
  getOwnerBookings: () => api.get('/owner/bookings'),
};

export default api;
