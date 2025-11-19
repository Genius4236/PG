import axios from 'axios';

const API = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Attach token from localStorage (or adapt to your Auth context)
API.interceptors.request.use((config) => {
	const token = localStorage.getItem('token') || localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, (err) => Promise.reject(err));

// Handle 401/403 errors
API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 || error.response?.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('authToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

// PG endpoints
export const pgAPI = {
	createPG: (formData) => {
		console.log('[pgAPI.createPG] POST /pgs');
		return API.post('/pgs', formData);
	},
	getOwnerPGs: () => {
		console.log('[pgAPI.getOwnerPGs] GET /pgs/owner/mine');
		return API.get('/pgs/owner/mine');
	},
	getPG: (id) => {
		console.log(`[pgAPI.getPG] GET /pgs/${id}`);
		return API.get(`/pgs/${id}`);
	},
	updatePG: (id, data) => {
		console.log(`[pgAPI.updatePG] PUT /pgs/${id}`);
		return API.put(`/pgs/${id}`, data);
	},
	deletePG: (id) => {
		console.log(`[pgAPI.deletePG] DELETE /pgs/${id}`);
		return API.delete(`/pgs/${id}`);
	}
};

// Booking endpoints
export const bookingAPI = {
	getOwnerBookings: async () => {
		// Try canonical route first, fall back to legacy alias if 404
		try {
			console.log('[bookingAPI.getOwnerBookings] TRY GET /bookings/owner/mine');
			return await API.get('/bookings/owner/mine');
		} catch (err) {
			if (err.response && err.response.status === 404) {
				console.warn('[bookingAPI.getOwnerBookings] /bookings/owner/mine 404, falling back to /owner/bookings');
				return API.get('/owner/bookings');
			}
			throw err;
		}
	}
};

// Auth endpoints
export const authAPI = {
	login: (data) => {
		console.log('[authAPI.login] POST /auth/login');
		return API.post('/auth/login', data);
	},
	signup: (data) => {
		console.log('[authAPI.signup] POST /auth/signup');
		return API.post('/auth/signup', data);
	},
	logout: () => {
		console.log('[authAPI.logout] POST /auth/logout');
		return API.post('/auth/logout');
	}
};

export default API;
